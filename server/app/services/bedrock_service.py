from typing import List, Dict, Any
import time
from anthropic import AnthropicBedrock

from ..config.settings import Settings
from ..core.logging import get_bedrock_logger


class BedrockService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.logger = get_bedrock_logger()
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
        start_time = time.time()
        message_count = len(messages)
        has_tools = bool(tools)
        has_system = bool(system)

        self.logger.info(
            "Creating Bedrock message",
            extra={
                "message_count": message_count,
                "has_tools": has_tools,
                "has_system": has_system,
                "model": self.settings.bedrock.model_id
            }
        )

        params = {
            "model": self.settings.bedrock.model_id,
            "max_tokens": self.settings.bedrock.max_tokens,
            "messages": messages,
        }

        if tools:
            params["tools"] = tools
            self.logger.debug(f"Using {len(tools)} tools", extra={"tool_count": len(tools)})
        if system:
            params["system"] = system

        try:
            response = self.client.messages.create(**params)
            duration = time.time() - start_time

            # レスポンス情報をログ
            response_info = {
                "duration": duration,
                "input_tokens": getattr(response.usage, 'input_tokens', 0),
                "output_tokens": getattr(response.usage, 'output_tokens', 0),
                "content_blocks": len(response.content) if response.content else 0
            }

            self.logger.info("Bedrock API call completed", extra=response_info)
            return response

        except Exception as e:
            duration = time.time() - start_time
            self.logger.error(
                "Bedrock API call failed",
                extra={"error": str(e), "duration": duration}
            )
            raise