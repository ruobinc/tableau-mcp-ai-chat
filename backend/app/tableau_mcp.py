import os
from typing import Optional, Dict, Any, List
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from dotenv import load_dotenv
from .bedrock import BedrockClient

load_dotenv()

SYSTEM_PROMPT = """
重要指示：
1. ユーザーが自身のデータについて質問した場合、即座にツールを使用して実際のデータを取得すること。単に「こうします」と説明するだけでは不十分です。
2. データ分析に関する質問には、以下の手順に従うこと：
   - データ構造を理解するため、read-metadata または list-fields を使用する
   - 質問に答えるために必要な実際のデータを取得するため、query-datasource を使用する
   - 結果を分析し、洞察を提供する
3. 「Xを行います」と言わないでください 
    - 利用可能なツールを使用して、直ちに X を実行してください。
4. 取得した実際のデータに基づいて、明確で実行可能な洞察を提供してください。
5. 出力結果はエクゼクティブサマリレポートとしてまとめる
"""

class MCPClient:
    def __init__(self):
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self.bedrock_client = BedrockClient()
        self.server_script_path = os.getenv(
            "SERVER_SCRIPT_PATH", 
        )

    async def connect_to_server(self):
        """Connect to the MCP Tableau server"""
        server_script_path = self.server_script_path
        is_python = server_script_path.endswith(".py")
        is_js = server_script_path.endswith(".js")
        
        if not (is_python or is_js):
            raise ValueError("Server script must be a .py or .js file")

        command = "python" if is_python else "node"
        server_params = StdioServerParameters(
            command=command,
            args=[server_script_path],
            env={
                "SERVER": os.getenv("TABLEAU_SERVER"),
                "SITE_NAME": os.getenv("TABLEAU_SITE_NAME"),
                "AUTH": os.getenv("TABLEAU_AUTH"),
                "JWT_SUB_CLAIM": os.getenv("TABLEAU_JWT_SUB_CLAIM"),
                "CONNECTED_APP_CLIENT_ID": os.getenv("TABLEAU_CONNECTED_APP_CLIENT_ID"),
                "CONNECTED_APP_CLIENT_SECRET": os.getenv("TABLEAU_CONNECTED_APP_CLIENT_SECRET"),
                "CONNECTED_APP_SECRET_VALUE": os.getenv("TABLEAU_CONNECTED_APP_SECRET_VALUE"),
                "PAT_NAME": os.getenv("TABLEAU_PAT_NAME"),
                "PAT_VALUE": os.getenv("TABLEAU_PAT_VALUE"),
                "DEFAULT_LOG_LEVEL": os.getenv("LOG_LEVEL", "debug"),
            },
        )

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

    async def get_available_tools(self) -> List[Dict[str, Any]]:
        """Get list of available tools from MCP server"""
        if not self.session:
            await self.connect_to_server()
        
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
            raise RuntimeError("MCP session not initialized. Call connect_to_server() first.")
        
        result = await self.session.call_tool(tool_name, tool_args)
        return result

    async def process_query_with_history(self, messages: List[Dict[str, Any]]) -> str:
        """Process a query using Claude and available tools with conversation history"""
        final_text = []

        # MCPが接続されている場合のみツールを使用
        if self.session:
            available_tools = await self.get_available_tools()
        else:
            available_tools = []

        response = self.bedrock_client.create_message(
            messages=messages,
            tools=available_tools if available_tools else None,
            system=SYSTEM_PROMPT if available_tools else "あなたはTableauデータ分析のアシスタントです。簡潔で実用的な回答を提供してください。"
        )

        process_query = True
        max_iterations = 10  # 無限ループを防ぐ
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
                response = self.bedrock_client.create_message(
                    messages=messages,
                    tools=available_tools,
                    system=SYSTEM_PROMPT
                )
            else:
                # ツール使用なし、完了
                process_query = False
        print("\n".join(final_text))
        return "\n".join(final_text)

    async def cleanup(self):
        """Clean up MCP resources"""
        await self.exit_stack.aclose()

async def main():
    client = MCPClient()
    try:
        await client.connect_to_server()
        response = await client.process_query("私が見れるデータソース一覧を教えてください")
        print(f"Response: {response}")
    finally:
        await client.cleanup()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())