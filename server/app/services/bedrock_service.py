from __future__ import annotations

from dataclasses import dataclass
from typing import List, Dict, Any, Iterable
from types import SimpleNamespace
import json
import time

import boto3

from ..config.settings import Settings
from ..core.logging import get_bedrock_logger


@dataclass
class BedrockUsage:
    input_tokens: int = 0
    output_tokens: int = 0
    total_tokens: int = 0


@dataclass
class BedrockResponse:
    content: List[Any]
    usage: BedrockUsage
    stop_reason: str | None = None
    model: str | None = None
    id: str | None = None
    raw_response: Dict[str, Any] | None = None


class BedrockService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.logger = get_bedrock_logger()
        client_kwargs = {"region_name": settings.aws.region}

        if settings.aws.bearer_token:
            client_kwargs["aws_bearer_token"] = settings.aws.bearer_token
        else:
            if settings.aws.access_key and settings.aws.secret_key:
                client_kwargs["aws_access_key_id"] = settings.aws.access_key
                client_kwargs["aws_secret_access_key"] = settings.aws.secret_key

            if settings.aws.session_token:
                client_kwargs["aws_session_token"] = settings.aws.session_token

        self.client = boto3.client("bedrock-runtime", **client_kwargs)

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

        payload = self._build_payload(messages, tools=tools, system=system)

        try:
            response = self.client.invoke_model(
                modelId=self.settings.bedrock.model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload).encode("utf-8"),
            )
            duration = time.time() - start_time

            parsed_response = self._parse_response(response)

            response_info = {
                "duration": duration,
                "input_tokens": parsed_response.usage.input_tokens,
                "output_tokens": parsed_response.usage.output_tokens,
                "content_blocks": len(parsed_response.content)
            }

            self.logger.info("Bedrock API call completed", extra=response_info)
            return parsed_response

        except Exception as e:
            duration = time.time() - start_time
            self.logger.error(
                "Bedrock API call failed",
                extra={"error": str(e), "duration": duration}
            )
            raise

    def _build_payload(
        self,
        messages: List[Dict[str, Any]],
        *,
        tools: List[Dict[str, Any]] | None = None,
        system: str | List[Dict[str, Any]] | None = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": self.settings.bedrock.max_tokens,
            "messages": list(self._serialize_messages(messages)),
        }

        if tools:
            payload["tools"] = tools
            self.logger.debug(f"Using {len(tools)} tools", extra={"tool_count": len(tools)})

        if system:
            payload["system"] = system

        return payload

    def _serialize_messages(self, messages: Iterable[Dict[str, Any]]) -> Iterable[Dict[str, Any]]:
        for message in messages:
            serialized: Dict[str, Any] = {k: v for k, v in message.items() if k != "content"}
            if "content" in message:
                content = message["content"]
                if isinstance(content, list):
                    serialized["content"] = [self._serialize_content_block(item) for item in content]
                else:
                    serialized["content"] = content
            yield serialized

    def _serialize_content_block(self, block: Any) -> Any:
        if isinstance(block, dict):
            return block

        if hasattr(block, "model_dump"):
            return block.model_dump()

        if hasattr(block, "to_dict"):
            return block.to_dict()

        if hasattr(block, "__dict__"):
            data = {
                key: value
                for key, value in block.__dict__.items()
                if not key.startswith("_")
            }
            if getattr(block, "type", None) is not None:
                data.setdefault("type", getattr(block, "type"))
            return data

        return block

    def _parse_response(self, response: Dict[str, Any]) -> BedrockResponse:
        body_bytes = response.get("body")
        if hasattr(body_bytes, "read"):
            body_bytes = body_bytes.read()

        if isinstance(body_bytes, bytes):
            body_str = body_bytes.decode("utf-8")
        else:
            body_str = body_bytes or "{}"

        data = json.loads(body_str)

        content_blocks = [self._to_namespace(block) for block in data.get("content", [])]

        usage_data = data.get("usage", {})
        usage = BedrockUsage(
            input_tokens=usage_data.get("input_tokens", 0),
            output_tokens=usage_data.get("output_tokens", 0),
            total_tokens=usage_data.get(
                "total_tokens",
                usage_data.get("input_tokens", 0) + usage_data.get("output_tokens", 0),
            ),
        )

        return BedrockResponse(
            content=content_blocks,
            usage=usage,
            stop_reason=data.get("stop_reason"),
            model=data.get("model"),
            id=data.get("id"),
            raw_response=data,
        )

    def _to_namespace(self, block: Any) -> Any:
        if isinstance(block, dict):
            return SimpleNamespace(**block)
        return block
