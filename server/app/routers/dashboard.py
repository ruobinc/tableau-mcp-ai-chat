import time
import uuid
from fastapi import APIRouter, Depends
from ..models.requests import CreateReportRequest
from ..models.responses import CreateReportResponse
from ..services.dashboard_service import DashboardService
from ..dependencies import get_dashboard_service
from ..core.response_utils import create_error_message
from ..core.logging import get_api_logger

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.post("/create_report", response_model=CreateReportResponse)
async def create_report(
    request: CreateReportRequest,
    dashboard_service: DashboardService = Depends(get_dashboard_service)
) -> CreateReportResponse:
    """レポート作成"""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    content_length = len(request.content)

    logger.info(
        "Report creation request received",
        extra={
            "request_id": request_id,
            "content_length": content_length,
            "timestamp": request.timestamp
        }
    )

    try:
        response_text = await dashboard_service.generate_dashboard_code(request.content)
        duration = time.time() - start_time

        logger.info(
            "Report creation completed successfully",
            extra={
                "request_id": request_id,
                "duration": duration,
                "response_length": len(response_text)
            }
        )

        return CreateReportResponse(
            code=response_text,
            timestamp=request.timestamp,
            success=True
        )

    except Exception as e:
        duration = time.time() - start_time
        logger.error(
            "Report creation failed",
            extra={
                "request_id": request_id,
                "error": str(e),
                "duration": duration
            }
        )
        return CreateReportResponse(
            code=f"// {create_error_message('レポート作成')}",
            timestamp=request.timestamp,
            success=False
        )


@router.post("/create_chart", response_model=CreateReportResponse)
async def create_chart(
    request: CreateReportRequest,
    dashboard_service: DashboardService = Depends(get_dashboard_service)
) -> CreateReportResponse:
    """チャート作成"""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    content_length = len(request.content)

    logger.info(
        "Chart creation request received",
        extra={
            "request_id": request_id,
            "content_length": content_length,
            "timestamp": request.timestamp
        }
    )

    try:
        response_text = await dashboard_service.generate_chart_code(request.content)
        duration = time.time() - start_time

        logger.info(
            "Chart creation completed successfully",
            extra={
                "request_id": request_id,
                "duration": duration,
                "response_length": len(response_text)
            }
        )

        return CreateReportResponse(
            code=response_text,
            timestamp=request.timestamp,
            success=True
        )

    except Exception as e:
        duration = time.time() - start_time
        logger.error(
            "Chart creation failed",
            extra={
                "request_id": request_id,
                "error": str(e),
                "duration": duration
            }
        )
        return CreateReportResponse(
            code=f"// {create_error_message('チャート作成')}",
            timestamp=request.timestamp,
            success=False
        )