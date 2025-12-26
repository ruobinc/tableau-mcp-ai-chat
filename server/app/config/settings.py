import os
from functools import lru_cache
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


def _parse_csv_env(value: str | None, fallback: list[str]) -> list[str]:
    if not value:
        return fallback
    items = [item.strip() for item in value.split(",") if item.strip()]
    return items or fallback


class TableauSettings(BaseModel):
    connected_app_client_id: str | None = None
    connected_app_client_secret: str | None = None
    connected_app_secret_value: str | None = None
    server: str | None = None
    site_name: str | None = None
    auth: str | None = None
    jwt_sub_claim: str | None = None
    pat_name: str | None = None
    pat_value: str | None = None


class LoggingSettings(BaseModel):
    level: str = "INFO"
    use_structured: bool = False
    enable_performance_logs: bool = True


class MCPSettings(BaseModel):
    server_script_path: str | None = None
    log_level: str = "debug"
    max_iterations: int = 20


class CORSSettings(BaseModel):
    allowed_origins: list[str] = []
    allow_credentials: bool = True
    allow_methods: list[str] = ["*"]
    allow_headers: list[str] = ["*"]


class Settings(BaseModel):
    app_title: str = "Tableau AI Chat API"
    app_version: str = "1.0.0"

    tableau: TableauSettings
    mcp: MCPSettings
    logging: LoggingSettings
    cors: CORSSettings

    def __init__(self, **kwargs):
        super().__init__(
            tableau=TableauSettings(
                connected_app_client_id=os.getenv("TABLEAU_CONNECTED_APP_CLIENT_ID"),
                connected_app_client_secret=os.getenv("TABLEAU_CONNECTED_APP_CLIENT_SECRET"),
                connected_app_secret_value=os.getenv("TABLEAU_CONNECTED_APP_SECRET_VALUE"),
                server=os.getenv("TABLEAU_SERVER"),
                site_name=os.getenv("TABLEAU_SITE_NAME"),
                auth=os.getenv("TABLEAU_AUTH"),
                jwt_sub_claim=os.getenv("TABLEAU_JWT_SUB_CLAIM"),
                pat_name=os.getenv("TABLEAU_PAT_NAME"),
                pat_value=os.getenv("TABLEAU_PAT_VALUE")
            ),
            mcp=MCPSettings(
                server_script_path=os.getenv("SERVER_SCRIPT_PATH"),
                log_level=os.getenv("LOG_LEVEL", "debug")
            ),
            logging=LoggingSettings(
                level=os.getenv("LOG_LEVEL", "INFO").upper(),
                use_structured=os.getenv("LOG_STRUCTURED", "false").lower() == "true",
                enable_performance_logs=os.getenv("LOG_PERFORMANCE", "true").lower() == "true"
            ),
            cors=CORSSettings(
                allowed_origins=_parse_csv_env(
                    os.getenv("CORS_ALLOWED_ORIGINS"),
                    CORSSettings().allowed_origins
                )
            ),
            **kwargs
        )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
