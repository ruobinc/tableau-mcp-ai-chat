from fastapi import APIRouter, Depends

from ..dependencies import get_auth_service
from ..models.requests import JWTRequest
from ..models.responses import JWTResponse
from ..services.auth_service import AuthService

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/jwt", response_model=JWTResponse)
async def generate_jwt(
    request: JWTRequest,
    auth_service: AuthService = Depends(get_auth_service)
) -> JWTResponse:
    """JWT トークンを生成"""
    try:
        if not auth_service.validate_tableau_credentials():
            raise ValueError("Tableau Connected App credentials not configured")

        token = auth_service.generate_jwt_token(
            username=request.username,
            token_expiry_minutes=5
        )

        return JWTResponse(token=token, success=True)

    except Exception as e:
        print(f"Error generating JWT: {e}")
        return JWTResponse(token="", success=False)
