import os
from functools import lru_cache
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


class AWSSettings(BaseModel):
    region: str = "ap-northeast-1"
    access_key: str | None = None
    secret_key: str | None = None
    session_token: str | None = None


class BedrockSettings(BaseModel):
    model_id: str = "apac.anthropic.claude-sonnet-4-20250514-v1:0"
    max_tokens: int = 10000


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


class MCPSettings(BaseModel):
    server_script_path: str | None = None
    log_level: str = "debug"
    max_iterations: int = 20
    system_prompt: str = """
重要指示：
1. ユーザーが自身のデータについて質問した場合、即座にツールを使用して実際のデータを取得すること。単に「こうします」と説明するだけでは不十分です。
2. データ分析に関する質問には、以下の手順に従うこと：
   - データ構造を理解するため、get-datasource-metadata を使用する
   - 質問に答えるために必要な実際のデータを取得するため、query-datasource を使用する
   - 結果を分析し、洞察を提供する
3. 「Xを行います」と言わないでください
    - 利用可能なツールを使用して、直ちに X を実行してください。
4. 取得した実際のデータに基づいて、明確で実行可能な洞察を提供してください。
5. 出力結果はエクゼクティブサマリレポートとしてまとめる
6. もしユーザーから'このビュー'や'このダッシュボード'と質問する際に、'get-view-data'を使い、view IDが'8073b84f-e050-4be1-9cb6-96fcffd53649'のデータを使って分析してください
"""


class CORSSettings(BaseModel):
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3002",
        "http://localhost:5173"
    ]
    allow_credentials: bool = True
    allow_methods: list[str] = ["*"]
    allow_headers: list[str] = ["*"]


class Settings(BaseModel):
    app_title: str = "Tableau AI Chat API"
    app_version: str = "1.0.0"

    aws: AWSSettings
    bedrock: BedrockSettings
    tableau: TableauSettings
    mcp: MCPSettings
    cors: CORSSettings

    def __init__(self, **kwargs):
        super().__init__(
            aws=AWSSettings(
                region=os.getenv("AWS_REGION", "ap-northeast-1"),
                access_key=os.getenv("AWS_ACCESS_KEY"),
                secret_key=os.getenv("AWS_SECRET_KEY"),
                session_token=os.getenv("AWS_SESSION_TOKEN")
            ),
            bedrock=BedrockSettings(
                model_id=os.getenv("BEDROCK_MODEL_ID", "apac.anthropic.claude-sonnet-4-20250514-v1:0"),
                max_tokens=int(os.getenv("MAX_TOKENS", "10000"))
            ),
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
            cors=CORSSettings(),
            **kwargs
        )


@lru_cache()
def get_settings() -> Settings:
    return Settings()