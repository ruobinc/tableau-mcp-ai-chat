from fastapi import Request
from fastapi.responses import JSONResponse


class CustomException(Exception):
    """カスタム例外基底クラス"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class BedrockError(CustomException):
    """Bedrock API関連エラー"""
    def __init__(self, message: str = "Bedrock API error occurred"):
        super().__init__(message, 500)


class MCPConnectionError(CustomException):
    """MCP接続関連エラー"""
    def __init__(self, message: str = "MCP connection error occurred"):
        super().__init__(message, 503)


class AuthenticationError(CustomException):
    """認証関連エラー"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, 401)


async def custom_exception_handler(request: Request, exc: CustomException):
    """カスタム例外ハンドラー"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message, "success": False}
    )


async def general_exception_handler(request: Request, exc: Exception):
    """一般的な例外ハンドラー"""
    return JSONResponse(
        status_code=500,
        content={
            "message": "申し訳ありません。現在システムでエラーが発生しています。しばらく後にもう一度お試しください。",
            "success": False
        }
    )