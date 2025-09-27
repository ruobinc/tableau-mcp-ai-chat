import time
import uuid
from fastapi import APIRouter, Depends
from ..models.requests import ChatRequest
from ..models.responses import ChatResponse
from ..services.mcp_service import MCPService
from ..dependencies import get_mcp_service
from ..core.response_utils import create_error_message
from ..core.logging import get_api_logger

router = APIRouter(prefix="/api", tags=["chat"])
logger = get_api_logger()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    mcp_service: MCPService = Depends(get_mcp_service)
) -> ChatResponse:
    """チャット処理"""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    message_count = len(request.messages)

    logger.info(
        "Chat request received",
        extra={
            "request_id": request_id,
            "message_count": message_count,
            "timestamp": request.timestamp
        }
    )

    try:
        # messagesリストをBedrockのフォーマットに変換
        bedrock_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in request.messages
        ]

        # mcp_serviceで全ての処理を実行
        response_text = await mcp_service.process_chat_with_history(bedrock_messages)
        duration = time.time() - start_time

        logger.info(
            "Chat request completed successfully",
            extra={
                "request_id": request_id,
                "duration": duration,
                "response_length": len(response_text)
            }
        )

        return ChatResponse(
            message=response_text,
            timestamp=request.timestamp,
            success=True
        )

    except Exception as e:
        duration = time.time() - start_time
        logger.error(
            "Chat request failed",
            extra={
                "request_id": request_id,
                "error": str(e),
                "duration": duration
            }
        )
        return ChatResponse(
            message=create_error_message("チャット処理"),
            timestamp=request.timestamp,
            success=False
        )