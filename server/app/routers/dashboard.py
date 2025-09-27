from fastapi import APIRouter, Depends
from ..models.requests import CreateReportRequest
from ..models.responses import CreateReportResponse
from ..services.dashboard_service import DashboardService
from ..dependencies import get_dashboard_service
from ..core.response_utils import create_error_message

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.post("/create_report", response_model=CreateReportResponse)
async def create_report(
    request: CreateReportRequest,
    dashboard_service: DashboardService = Depends(get_dashboard_service)
) -> CreateReportResponse:
    """レポート作成"""
    try:
        response_text = await dashboard_service.generate_dashboard_code(request.content)

        return CreateReportResponse(
            code=response_text,
            timestamp=request.timestamp,
            success=True
        )

    except Exception as e:
        print(f"Error creating report: {e}")
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
    try:
        response_text = await dashboard_service.generate_chart_code(request.content)

        return CreateReportResponse(
            code=response_text,
            timestamp=request.timestamp,
            success=True
        )

    except Exception as e:
        print(f"Error creating chart: {e}")
        return CreateReportResponse(
            code=f"// {create_error_message('チャート作成')}",
            timestamp=request.timestamp,
            success=False
        )