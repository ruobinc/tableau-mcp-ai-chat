import time
import uuid
from fastapi import APIRouter
from ..models.requests import ChatRequest
from ..models.responses import ChatResponse
from ..services.bedrock_service import BedrockService
from ..services.mcp_service import MCPService
from ..config.settings import get_settings
from ..core.response_utils import create_error_message
from ..core.logging import get_api_logger

router = APIRouter(prefix="/api", tags=["chat"])
logger = get_api_logger()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """チャット処理"""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    message_count = len(request.messages)

    logger.info(
        "Chat request received",
        extra={
            "request_id": request_id,
            "message_count": message_count,
            "timestamp": request.timestamp,
            "aws_region": request.aws_region,
            "bedrock_model_id": request.bedrock_model_id,
            "max_tokens": request.max_tokens
        }
    )

    # MCPServiceをインスタンス化
    settings = get_settings()
    mcp_service = MCPService(settings)

    try:
        # リクエストからBedrock設定を取得してBedrockServiceをインスタンス化
        bedrock_service = BedrockService(
            aws_region=request.aws_region,
            aws_bearer_token=request.aws_bearer_token,
            bedrock_model_id=request.bedrock_model_id,
            max_tokens=request.max_tokens
        )

        # BedrockServiceを設定
        mcp_service.set_bedrock_service(bedrock_service)

        # MCPサーバーに接続を試行
        await mcp_service.connect()

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
    finally:
        # MCPセッションを必ずクリーンアップ
        await mcp_service.cleanup()