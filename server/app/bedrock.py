import os
from typing import List, Dict, Any
from anthropic import AnthropicBedrock
from dotenv import load_dotenv

load_dotenv()

class BedrockClient:
    def __init__(self):
        self.max_tokens = int(os.getenv("MAX_TOKENS", "10000"))
        self.model_id = os.getenv("BEDROCK_MODEL_ID", "apac.anthropic.claude-sonnet-4-20250514-v1:0")
        
        # AWS認証情報は環境変数から取得
        self.client = AnthropicBedrock(
            aws_region=os.getenv("AWS_REGION", "ap-northeast-1"),
            aws_access_key=os.getenv("AWS_ACCESS_KEY"),
            aws_secret_key=os.getenv("AWS_SECRET_KEY"),
            aws_session_token=os.getenv("AWS_SESSION_TOKEN")
        )

    def create_message(
        self, 
        messages: List[Dict[str, Any]], 
        tools: List[Dict[str, Any]] = None,
        system: str = None
    ):
        """Anthropic Bedrock API呼び出し"""
        params = {
            "model": self.model_id,
            "max_tokens": self.max_tokens,
            "messages": messages,
        }
        
        if tools:
            params["tools"] = tools
        if system:
            params["system"] = system
            
        return self.client.messages.create(**params)