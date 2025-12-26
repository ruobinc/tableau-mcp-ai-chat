from pydantic import BaseModel, field_validator
from typing import List


class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    timestamp: str
    # Bedrock設定（必須フィールド）
    aws_region: str
    aws_bearer_token: str
    bedrock_model_id: str
    max_tokens: int

    @field_validator('max_tokens')
    @classmethod
    def validate_max_tokens(cls, v):
        if v < 100 or v > 200000:
            raise ValueError('max_tokens must be between 100 and 200000')
        return v


class CreateReportRequest(BaseModel):
    content: str  # Bot message content to visualize
    timestamp: str
    # Bedrock設定（必須フィールド）
    aws_region: str
    aws_bearer_token: str
    bedrock_model_id: str
    max_tokens: int

    @field_validator('max_tokens')
    @classmethod
    def validate_max_tokens(cls, v):
        if v < 100 or v > 200000:
            raise ValueError('max_tokens must be between 100 and 200000')
        return v


class JWTRequest(BaseModel):
    username: str


class BedrockSettingsRequest(BaseModel):
    aws_region: str
    aws_bearer_token: str
    bedrock_model_id: str
    max_tokens: int

    @field_validator('max_tokens')
    @classmethod
    def validate_max_tokens(cls, v):
        if v < 100 or v > 200000:
            raise ValueError('max_tokens must be between 100 and 200000')
        return v