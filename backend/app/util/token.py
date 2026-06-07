from flask_jwt_extended import create_access_token, decode_token
from flask_jwt_extended.exceptions import JWTDecodeError
from jwt.exceptions import ExpiredSignatureError

def generate_token(user_id: str, role: str) -> str:
    return create_access_token(
        identity=str(user_id),
        additional_claims={"role": role}
    )

def verify_token(token: str) -> dict:
    try:
        decoded = decode_token(token)
        return {
            "user_id": decoded.get("sub"),   # flask-jwt stores identity in "sub"
            "role":    decoded.get("role")
        }
    except ExpiredSignatureError:
        raise ValueError("Token has expired")
    except JWTDecodeError:
        raise ValueError("Invalid token")