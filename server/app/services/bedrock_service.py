from typing import List, Dict, Any
from anthropic import AnthropicBedrock

from ..config.settings import Settings


class BedrockService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = AnthropicBedrock(
            aws_region=settings.aws.region,
            aws_access_key=settings.aws.access_key,
            aws_secret_key=settings.aws.secret_key,
            aws_session_token=settings.aws.session_token
        )

    def create_message(
        self,
        messages: List[Dict[str, Any]],
        tools: List[Dict[str, Any]] = None,
        system: str = None
    ):
        """Anthropic Bedrock API呼び出し"""
        params = {
            "model": self.settings.bedrock.model_id,
            "max_tokens": self.settings.bedrock.max_tokens,
            "messages": messages,
        }

        if tools:
            params["tools"] = tools
        if system:
            params["system"] = system

        return self.client.messages.create(**params)