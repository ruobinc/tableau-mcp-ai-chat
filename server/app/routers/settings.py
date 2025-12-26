from fastapi import APIRouter
from ..models.requests import BedrockSettingsRequest
from ..models.responses import ValidationResponse
from ..services.bedrock_service import BedrockService
from ..core.logging import get_api_logger

router = APIRouter(prefix="/api", tags=["settings"])
logger = get_api_logger()


@router.post("/settings/bedrock/validate", response_model=ValidationResponse)
async def validate_bedrock_settings(request: BedrockSettingsRequest) -> ValidationResponse:
    """Bedrock設定の検証（接続テスト）"""
    logger.info("Validating Bedrock settings", extra={"region": request.aws_region, "model_id": request.bedrock_model_id})

    try:
        # BedrockServiceを設定でインスタンス化
        bedrock_service = BedrockService(
            aws_region=request.aws_region,
            aws_bearer_token=request.aws_bearer_token,
            bedrock_model_id=request.bedrock_model_id,
            max_tokens=request.max_tokens
        )

        # 簡単なテストメッセージで接続確認
        test_messages = [{"role": "user", "content": "Hello"}]
        response = bedrock_service.create_message(messages=test_messages)

        logger.info("Bedrock settings validation successful")
        return ValidationResponse(
            valid=True,
            message="接続に成功しました"
        )
    except Exception as e:
        logger.error(f"Bedrock settings validation failed: {str(e)}")
        return ValidationResponse(
            valid=False,
            message=f"接続に失敗しました: {str(e)}"
        )
