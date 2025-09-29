from typing import Optional, Dict, Any, List
from contextlib import AsyncExitStack
import time

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from .bedrock_service import BedrockService
from ..config.settings import Settings
from ..config.prompts import MCP_SYSTEM_PROMPT, SIMPLE_CHAT_FALLBACK_PROMPT, TABLEAU_ANALYSIS_FALLBACK_PROMPT
from ..core.exceptions import MCPConnectionError, BedrockError
from ..core.response_utils import extract_text_from_response, format_tool_execution_log, create_error_message
from ..core.logging import get_mcp_logger


class MCPService:
    def __init__(self, settings: Settings, bedrock_service: BedrockService):
        self.settings = settings
        self.bedrock_service = bedrock_service
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self._is_connected = False
        self.logger = get_mcp_logger()

    async def connect(self) -> bool:
        """MCPサーバーに接続を試行"""
        start_time = time.time()
        try:
            self.logger.info("MCP server connection attempt started")
            await self._connect_to_server()
            self._is_connected = True
            duration = time.time() - start_time
            self.logger.info("MCP server connected successfully", extra={"duration": duration})
            return True
        except Exception as e:
            duration = time.time() - start_time
            self.logger.warning(
                "Could not connect to MCP server, using fallback mode",
                extra={"error": str(e), "duration": duration}
            )
            self._is_connected = False
            return False

    async def _connect_to_server(self):
        """Connect to the MCP Tableau server"""
        server_script_path = self.settings.mcp.server_script_path

        if not server_script_path:
            raise MCPConnectionError("SERVER_SCRIPT_PATH not configured")

        is_python = server_script_path.endswith(".py")
        is_js = server_script_path.endswith(".js")

        if not (is_python or is_js):
            raise MCPConnectionError("Server script must be a .py or .js file")

        command = "python" if is_python else "node"
        server_params = StdioServerParameters(
            command=command,
            args=[server_script_path],
            env=self._build_server_env(),
        )

        try:
            stdio_transport = await self.exit_stack.enter_async_context(
                stdio_client(server_params)
            )
            self.stdio, self.write = stdio_transport
            self.session = await self.exit_stack.enter_async_context(
                ClientSession(self.stdio, self.write)
            )

            await self.session.initialize()

            response = await self.session.list_tools()
            tools = response.tools
            tool_names = [tool.name for tool in tools]
            self.logger.info(
                f"Connected to MCP server with {len(tools)} tools",
                extra={"tool_count": len(tools), "tools": tool_names}
            )
            return tools
        except Exception as e:
            raise MCPConnectionError(f"Failed to connect to MCP server: {str(e)}")

    def _build_server_env(self) -> Dict[str, str]:
        """Build environment variables for MCP server"""
        return {
            "SERVER": self.settings.tableau.server or "",
            "SITE_NAME": self.settings.tableau.site_name or "",
            "AUTH": self.settings.tableau.auth or "",
            "JWT_SUB_CLAIM": self.settings.tableau.jwt_sub_claim or "",
            "CONNECTED_APP_CLIENT_ID": self.settings.tableau.connected_app_client_id or "",
            "CONNECTED_APP_SECRET_ID": self.settings.tableau.connected_app_client_secret or "",
            "CONNECTED_APP_SECRET_VALUE": self.settings.tableau.connected_app_secret_value or "",
            "PAT_NAME": self.settings.tableau.pat_name or "",
            "PAT_VALUE": self.settings.tableau.pat_value or "",
            "DEFAULT_LOG_LEVEL": self.settings.mcp.log_level,
            "EXCLUDE_TOOLS": "",
        }

    async def get_available_tools(self) -> List[Dict[str, Any]]:
        """Get list of available tools from MCP server"""
        if not self.session:
            await self._connect_to_server()

        response = await self.session.list_tools()
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "input_schema": tool.inputSchema,
            }
            for tool in response.tools
        ]

    async def call_tool(self, tool_name: str, tool_args: Dict[str, Any]):
        """Execute a tool call via MCP"""
        if not self.session:
            raise MCPConnectionError("MCP session not initialized. Call connect_to_server() first.")

        start_time = time.time()
        try:
            self.logger.debug(f"Executing tool: {tool_name}", extra={"tool": tool_name, "args": tool_args})
            result = await self.session.call_tool(tool_name, tool_args)
            duration = time.time() - start_time
            self.logger.info(
                f"Tool executed successfully: {tool_name}",
                extra={"tool": tool_name, "duration": duration}
            )
            return result
        except Exception as e:
            duration = time.time() - start_time
            self.logger.error(
                f"Tool execution failed: {tool_name}",
                extra={"tool": tool_name, "error": str(e), "duration": duration}
            )
            raise MCPConnectionError(f"Tool execution failed for {tool_name}: {str(e)}")

    async def process_chat_with_history(self, messages: List[Dict[str, Any]]) -> str:
        """チャット履歴を含むクエリ処理"""
        start_time = time.time()
        message_count = len(messages)
        self.logger.info(
            f"Processing chat with {message_count} messages",
            extra={"message_count": message_count, "has_mcp": self._is_connected}
        )

        try:
            if self._is_connected:
                result = await self._process_query_with_tools(messages)
            else:
                # MCP未接続時のフォールバック
                result = await self._simple_chat_fallback(messages)

            duration = time.time() - start_time
            self.logger.info(
                "Chat processing completed",
                extra={"duration": duration, "response_length": len(result)}
            )
            return result
        except Exception as e:
            duration = time.time() - start_time
            self.logger.error(
                "Chat processing failed",
                extra={"error": str(e), "duration": duration}
            )
            raise

    async def _process_query_with_tools(self, messages: List[Dict[str, Any]]) -> str:
        """Process a query using Claude and available tools with conversation history"""
        final_text = []

        try:
            # MCPが接続されている場合のみツールを使用
            if self.session:
                available_tools = await self.get_available_tools()
            else:
                available_tools = []

            self.logger.debug(f"Available tools: {[tool['name'] for tool in available_tools]}", extra={"tool_count": len(available_tools)})

            system_prompt = (
                MCP_SYSTEM_PROMPT if available_tools
                else TABLEAU_ANALYSIS_FALLBACK_PROMPT
            )

            response = self.bedrock_service.create_message(
                messages=messages,
                tools=available_tools if available_tools else None,
                system=system_prompt
            )

            process_query = True
            max_iterations = self.settings.mcp.max_iterations
            iteration = 0

            while process_query and iteration < max_iterations:
                iteration += 1
                assistant_message_content = []

                for content in response.content:
                    assistant_message_content.append(content)

                    if content.type == "text":
                        final_text.append(content.text)

                    elif content.type == "tool_use":
                        tool_name = content.name
                        final_text.append(format_tool_execution_log(tool_name))

                # ツール使用ブロックを確認
                tool_use_blocks = [c for c in response.content if c.type == "tool_use"]

                if tool_use_blocks and self.session:
                    # アシスタントメッセージを追加
                    messages.append(
                        {"role": "assistant", "content": assistant_message_content}
                    )

                    # ツールを実行して結果を追加
                    tool_results = []
                    for content in tool_use_blocks:
                        try:
                            result = await self.call_tool(content.name, content.input)
                            tool_results.append({
                                "type": "tool_result",
                                "tool_use_id": content.id,
                                "content": result.content if hasattr(result, 'content') else str(result),
                            })
                        except Exception as e:
                            tool_results.append({
                                "type": "tool_result",
                                "tool_use_id": content.id,
                                "content": f"ツールの実行でエラーが発生しました: {str(e)}",
                            })

                    messages.append({
                        "role": "user",
                        "content": tool_results
                    })

                    # ツール結果を含む次のレスポンスを取得
                    response = self.bedrock_service.create_message(
                        messages=messages,
                        tools=available_tools,
                        system=system_prompt
                    )
                else:
                    # ツール使用なし、完了
                    process_query = False
                    response_text = final_text[-1]

            self.logger.debug("Query processing result", extra={"response_length": len("\n".join(final_text))})
            # return "\n".join(final_text)
            return response_text

        except Exception as e:
            raise BedrockError(f"Query processing failed: {str(e)}")

    async def _simple_chat_fallback(self, messages: List[Dict[str, Any]]) -> str:
        """MCP未接続時のシンプルな対話処理"""
        try:
            response = self.bedrock_service.create_message(
                messages=messages,
                system=SIMPLE_CHAT_FALLBACK_PROMPT
            )

            return extract_text_from_response(response.content)
        except Exception as e:
            self.logger.error("Simple chat fallback failed", extra={"error": str(e)})
            return create_error_message("チャット処理")

    async def cleanup(self):
        """リソースクリーンアップ"""
        if self._is_connected:
            await self.exit_stack.aclose()

    @property
    def is_connected(self) -> bool:
        """MCP接続状態を返す"""
        return self._is_connected