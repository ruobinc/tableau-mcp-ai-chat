import datetime
import uuid
import jwt
from ..config.settings import Settings


class AuthService:
    def __init__(self, settings: Settings):
        self.settings = settings

    def generate_jwt_token(self, username: str, token_expiry_minutes: int = 1) -> str:
        """Tableau用JWTトークンを生成"""
        scopes = [
            "tableau:views:embed",
            "tableau:views:embed_authoring",
            "tableau:insights:embed"
        ]

        now = datetime.datetime.now(datetime.timezone.utc)
        exp = now + datetime.timedelta(minutes=token_expiry_minutes)

        payload = {
            "iss": self.settings.tableau.connected_app_client_id,
            "exp": exp,
            "nbf": now,
            "jti": str(uuid.uuid4()),
            "aud": "tableau",
            "sub": username,
            "scp": scopes,
        }

        token = jwt.encode(
            payload,
            self.settings.tableau.connected_app_secret_value,
            algorithm="HS256",
            headers={
                "kid": self.settings.tableau.connected_app_client_secret,
                "iss": self.settings.tableau.connected_app_client_id,
            },
        )

        return token

    def validate_tableau_credentials(self) -> bool:
        """Tableau Connected App認証情報の検証"""
        return all([
            self.settings.tableau.connected_app_client_id,
            self.settings.tableau.connected_app_client_secret,
            self.settings.tableau.connected_app_secret_value
        ])