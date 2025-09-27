from fastapi import APIRouter, Depends
from ..models.requests import ChatRequest
from ..models.responses import ChatResponse
from ..services.mcp_service import MCPService
from ..dependencies import get_mcp_service
from ..core.response_utils import create_error_message

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    mcp_service: MCPService = Depends(get_mcp_service)
) -> ChatResponse:
    """チャット処理"""
    try:
        # messagesリストをBedrockのフォーマットに変換
        bedrock_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in request.messages
        ]

        # mcp_serviceで全ての処理を実行
        response_text = await mcp_service.process_chat_with_history(bedrock_messages)

        return ChatResponse(
            message=response_text,
            timestamp=request.timestamp,
            success=True
        )

    except Exception as e:
        print(f"Error processing chat request: {e}")
        return ChatResponse(
            message=create_error_message("チャット処理"),
            timestamp=request.timestamp,
            success=False
        )