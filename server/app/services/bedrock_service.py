from typing import List, Dict, Any
import time
import os
import boto3

from ..core.logging import get_bedrock_logger


class BedrockService:
    def __init__(
        self,
        aws_region: str,
        aws_bearer_token: str,
        bedrock_model_id: str,
        max_tokens: int
    ):
        self.aws_region = aws_region
        self.bedrock_model_id = bedrock_model_id
        self.max_tokens = max_tokens
        self.logger = get_bedrock_logger()

        # Bearer Tokenを環境変数に設定（boto3が自動読み込み）
        os.environ['AWS_BEARER_TOKEN_BEDROCK'] = aws_bearer_token

        # boto3クライアント初期化
        self.client = boto3.client(
            service_name="bedrock-runtime",
            region_name=aws_region
        )

    def create_message(
        self,
        messages: List[Dict[str, Any]],
        tools: List[Dict[str, Any]] = None,
        system: str = None
    ):
        """Anthropic Bedrock API呼び出し（boto3 Converse API経由）"""
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
                "model": self.bedrock_model_id,
                "max_tokens": self.max_tokens
            }
        )

        # メッセージフォーマット変換
        bedrock_messages = self._convert_messages_to_bedrock_format(messages)

        params = {
            "modelId": self.bedrock_model_id,
            "messages": bedrock_messages,
            "inferenceConfig": {
                "maxTokens": self.max_tokens
            }
        }

        if system:
            params["system"] = [{"text": system}]

        if tools:
            params["toolConfig"] = {
                "tools": self._convert_tools_to_bedrock_format(tools)
            }
            self.logger.debug(f"Using {len(tools)} tools", extra={"tool_count": len(tools)})

        try:
            response = self.client.converse(**params)
            duration = time.time() - start_time

            # レスポンス情報をログ
            usage = response.get('usage', {})
            response_info = {
                "duration": duration,
                "input_tokens": usage.get('inputTokens', 0),
                "output_tokens": usage.get('outputTokens', 0),
                "stop_reason": response.get('stopReason', 'unknown')
            }

            self.logger.info("Bedrock API call completed", extra=response_info)

            # Anthropic互換形式に変換して返却
            return self._convert_bedrock_response_to_anthropic_format(response)

        except Exception as e:
            duration = time.time() - start_time
            self.logger.error(
                "Bedrock API call failed",
                extra={"error": str(e), "duration": duration}
            )
            raise

    def _convert_messages_to_bedrock_format(self, messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Anthropic形式のメッセージをBedrock Converse API形式に変換"""
        bedrock_messages = []

        for msg in messages:
            role = msg.get("role")
            content = msg.get("content")

            # contentが文字列の場合
            if isinstance(content, str):
                bedrock_messages.append({
                    "role": role,
                    "content": [{"text": content}]
                })
            # contentが既にリスト形式の場合
            elif isinstance(content, list):
                converted_content = []
                for block in content:
                    # ContentBlockオブジェクトの場合
                    if hasattr(block, 'to_dict'):
                        block = block.to_dict()

                    if isinstance(block, dict):
                        block_type = block.get("type")

                        if block_type == "text":
                            converted_content.append({"text": block.get("text", "")})

                        elif block_type == "tool_use":
                            converted_content.append({
                                "toolUse": {
                                    "toolUseId": block.get("id"),
                                    "name": block.get("name"),
                                    "input": block.get("input", {})
                                }
                            })

                        elif block_type == "tool_result":
                            tool_result_content = block.get("content")
                            if isinstance(tool_result_content, str):
                                result_content = [{"text": tool_result_content}]
                            elif isinstance(tool_result_content, list):
                                result_content = [{"text": str(item)} for item in tool_result_content]
                            else:
                                result_content = [{"text": str(tool_result_content)}]

                            converted_content.append({
                                "toolResult": {
                                    "toolUseId": block.get("tool_use_id"),
                                    "content": result_content
                                }
                            })
                    else:
                        # blockが辞書でない場合は文字列として扱う
                        converted_content.append({"text": str(block)})

                bedrock_messages.append({"role": role, "content": converted_content})

        return bedrock_messages

    def _convert_tools_to_bedrock_format(self, tools: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Anthropic tools形式をBedrock toolConfig形式に変換"""
        bedrock_tools = []

        for tool in tools:
            bedrock_tools.append({
                "toolSpec": {
                    "name": tool.get("name"),
                    "description": tool.get("description", ""),
                    "inputSchema": {
                        "json": tool.get("input_schema", {})
                    }
                }
            })

        return bedrock_tools

    def _convert_bedrock_response_to_anthropic_format(self, bedrock_response: Dict[str, Any]):
        """Bedrock Converse APIのレスポンスをAnthropic形式に変換"""
        output_message = bedrock_response.get("output", {}).get("message", {})
        usage_info = bedrock_response.get("usage", {})
        stop_reason = bedrock_response.get("stopReason")

        # Anthropic形式のcontentブロックを構築（オブジェクト形式）
        class ContentBlock:
            def __init__(self, block_type, **kwargs):
                self.type = block_type
                self._kwargs = kwargs
                for key, value in kwargs.items():
                    setattr(self, key, value)

            def to_dict(self):
                """ContentBlockを辞書形式に変換"""
                result = {"type": self.type}
                result.update(self._kwargs)
                return result

        anthropic_content = []
        for block in output_message.get("content", []):
            if "text" in block:
                anthropic_content.append(
                    ContentBlock("text", text=block["text"])
                )
            elif "toolUse" in block:
                tool_use = block["toolUse"]
                anthropic_content.append(
                    ContentBlock(
                        "tool_use",
                        id=tool_use.get("toolUseId"),
                        name=tool_use.get("name"),
                        input=tool_use.get("input", {})
                    )
                )

        # Anthropic互換のレスポンスオブジェクトを構築
        class Usage:
            def __init__(self, input_tokens, output_tokens):
                self.input_tokens = input_tokens
                self.output_tokens = output_tokens

        class Message:
            def __init__(self, content, role, stop_reason, usage):
                self.content = content
                self.role = role
                self.stop_reason = self._convert_stop_reason(stop_reason)
                self.usage = usage

            def _convert_stop_reason(self, bedrock_stop_reason: str) -> str:
                """BedrockのstopReasonをAnthropic形式に変換"""
                mapping = {
                    "end_turn": "end_turn",
                    "tool_use": "tool_use",
                    "max_tokens": "max_tokens",
                    "stop_sequence": "stop_sequence"
                }
                return mapping.get(bedrock_stop_reason, "end_turn")

        usage = Usage(
            input_tokens=usage_info.get("inputTokens", 0),
            output_tokens=usage_info.get("outputTokens", 0)
        )

        return Message(
            content=anthropic_content,
            role=output_message.get("role", "assistant"),
            stop_reason=stop_reason,
            usage=usage
        )
