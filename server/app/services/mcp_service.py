from typing import List, Dict, Any
from ..tableau_mcp import MCPClient
from .bedrock_service import BedrockService


class MCPService:
    def __init__(self, bedrock_service: BedrockService):
        self.mcp_client = MCPClient()
        self.bedrock_service = bedrock_service
        self._is_connected = False

    async def connect(self) -> bool:
        """MCPサーバーに接続を試行"""
        try:
            await self.mcp_client.connect_to_server()
            self._is_connected = True
            return True
        except Exception as e:
            print(f"Warning: Could not connect to MCP server: {e}")
            print("Will use simple mode without Tableau integration")
            self._is_connected = False
            return False

    async def process_chat_with_history(self, messages: List[Dict[str, Any]]) -> str:
        """チャット履歴を含むクエリ処理"""
        if self._is_connected:
            return await self.mcp_client.process_query_with_history(messages)
        else:
            # MCP未接続時のフォールバック
            return await self._simple_chat_fallback(messages)

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
        if self._is_connected and self.mcp_client:
            await self.mcp_client.cleanup()

    @property
    def is_connected(self) -> bool:
        """MCP接続状態を返す"""
        return self._is_connected