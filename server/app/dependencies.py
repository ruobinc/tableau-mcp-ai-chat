from functools import lru_cache
from .config.settings import get_settings
from .services.auth_service import AuthService


@lru_cache()
def get_auth_service() -> AuthService:
    """AuthServicen"""
    settings = get_settings()
    return AuthService(settings)