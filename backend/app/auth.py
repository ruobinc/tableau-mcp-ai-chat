import datetime
import uuid
import jwt
from urllib.parse import urlparse

def generate_jwt_token(secret_id, secret_value, client_id, username, token_expiry_minutes=1):
    scopes = [
        "tableau:views:embed",
        "tableau:views:embed_authoring",
        "tableau:insights:embed"
    ]
    
    now = datetime.datetime.now(datetime.timezone.utc)
    exp = now + datetime.timedelta(minutes=token_expiry_minutes)

    payload = {
        "iss": client_id,
        "exp": exp,
        "nbf": now,
        "jti": str(uuid.uuid4()),
        "aud": "https://prod-apnortheast-a.online.tableau.com",
        "sub": username,
        "scp": scopes,
    }
    
    token = jwt.encode(
        payload,
        secret_value,
        algorithm="HS256",
        headers={
            "kid": secret_id,
            "iss": client_id,
        },
    )
    
    return token