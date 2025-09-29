from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from .config.settings import get_settings
from .dependencies import get_mcp_service
from .core.exceptions import (
    CustomException,
    custom_exception_handler,
    general_exception_handler
)
from .routers import chat, dashboard, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    mcp_service = get_mcp_service()

    # Try to connect to MCP server (optional - may fail if server not available)
    try:
        success = await mcp_service.connect()
        if success:
            print("MCP server connected successfully")
        else:
            print("Will use simple mode without Tableau integration")
    except Exception as e:
        print(f"Warning: Could not connect to MCP server: {e}")
        print("Will use simple mode without Tableau integration")

    yield

    # Shutdown
    await mcp_service.cleanup()


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_title,
        version=settings.app_version,
        lifespan=lifespan
    )

    # CORS設定
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors.allowed_origins,
        allow_credentials=settings.cors.allow_credentials,
        allow_methods=settings.cors.allow_methods,
        allow_headers=settings.cors.allow_headers,
    )

    # 例外ハンドラー登録
    app.add_exception_handler(CustomException, custom_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    # ルーター登録
    app.include_router(chat.router)
    app.include_router(dashboard.router)
    app.include_router(auth.router)

    @app.get("/")
    async def root():
        return {"message": "Tableau AI Chat API is running"}

    return app


app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
