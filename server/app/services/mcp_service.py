from typing import Optional, Dict, Any, List
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from .bedrock_service import BedrockService
from ..config.settings import Settings
from ..core.exceptions import MCPConnectionError, BedrockError


class MCPService:
    def __init__(self, settings: Settings, bedrock_service: BedrockService):
        self.settings = settings
        self.bedrock_service = bedrock_service
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self._is_connected = False

    async def connect(self) -> bool:
        """MCPサーバーに接続を試行"""
        try:
            await self._connect_to_server()
            self._is_connected = True
            return True
        except Exception as e:
            print(f"Warning: Could not connect to MCP server: {e}")
            print("Will use simple mode without Tableau integration")
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
            print(f"Connected to MCP server with {len(tools)} tools:", [tool.name for tool in tools])
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

        try:
            result = await self.session.call_tool(tool_name, tool_args)
            return result
        except Exception as e:
            raise MCPConnectionError(f"Tool execution failed for {tool_name}: {str(e)}")

    async def process_chat_with_history(self, messages: List[Dict[str, Any]]) -> str:
        """チャット履歴を含むクエリ処理"""
        if self._is_connected:
            return await self._process_query_with_tools(messages)
        else:
            # MCP未接続時のフォールバック
            return await self._simple_chat_fallback(messages)

    async def _process_query_with_tools(self, messages: List[Dict[str, Any]]) -> str:
        """Process a query using Claude and available tools with conversation history"""
        final_text = []

        try:
            # MCPが接続されている場合のみツールを使用
            if self.session:
                available_tools = await self.get_available_tools()
            else:
                available_tools = []

            print(f"Available tools: {available_tools}")

            system_prompt = (
                self.settings.mcp.system_prompt if available_tools
                else "あなたはTableauデータ分析のアシスタントです。簡潔で実用的な回答を提供してください。"
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
                        final_text.append(f"[ツール実行: {tool_name}]")

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

            print("\n".join(final_text))
            return "\n".join(final_text)

        except Exception as e:
            raise BedrockError(f"Query processing failed: {str(e)}")

    async def _simple_chat_fallback(self, messages: List[Dict[str, Any]]) -> str:
        """MCP未接続時のシンプルな対話処理"""
        try:
            response = self.bedrock_service.create_message(
                messages=messages,
                system="あなたは親切なAIアシスタントです。ユーザーの質問に日本語で答えてください。"
            )

            final_text = []
            for content_item in response.content:
                if content_item.type == "text":
                    final_text.append(content_item.text)

            return "\n".join(final_text)
        except Exception as e:
            print(f"Error in simple chat fallback: {e}")
            return "申し訳ありません。現在システムでエラーが発生しています。しばらく後にもう一度お試しください。"

    async def cleanup(self):
        """リソースクリーンアップ"""
        if self._is_connected:
            await self.exit_stack.aclose()

    @property
    def is_connected(self) -> bool:
        """MCP接続状態を返す"""
        return self._is_connected