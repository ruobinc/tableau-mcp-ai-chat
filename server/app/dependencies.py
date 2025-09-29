from functools import lru_cache
from .config.settings import get_settings
from .services.bedrock_service import BedrockService
from .services.auth_service import AuthService
from .services.dashboard_service import DashboardService
from .services.mcp_service import MCPService


@lru_cache()
def get_bedrock_service() -> BedrockService:
    """BedrockServicen"""
    settings = get_settings()
    return BedrockService(settings)


@lru_cache()
def get_auth_service() -> AuthService:
    """AuthServicen"""
    settings = get_settings()
    return AuthService(settings)


@lru_cache()
def get_dashboard_service() -> DashboardService:
    """DashboardServicen"""
    bedrock_service = get_bedrock_service()
    return DashboardService(bedrock_service)


@lru_cache()
def get_mcp_service() -> MCPService:
    """MCPServiceのインスタンスを取得"""
    settings = get_settings()
    bedrock_service = get_bedrock_service()
    return MCPService(settings, bedrock_service)