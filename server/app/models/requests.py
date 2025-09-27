from pydantic import BaseModel
from typing import List


class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    timestamp: str


class CreateReportRequest(BaseModel):
    content: str  # Bot message content to visualize
    timestamp: str


class JWTRequest(BaseModel):
    username: str