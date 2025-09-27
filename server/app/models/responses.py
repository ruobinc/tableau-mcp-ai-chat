from pydantic import BaseModel


class CreateReportResponse(BaseModel):
    code: str
    timestamp: str
    success: bool


class ChatResponse(BaseModel):
    message: str
    timestamp: str
    success: bool


class JWTResponse(BaseModel):
    token: str
    success: bool