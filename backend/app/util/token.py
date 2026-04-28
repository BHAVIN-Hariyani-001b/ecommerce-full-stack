import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv() 

SECRET_KEY = os.getenv("SECRET_KEY")

def generate_token(user_id : int, role :str) -> str:
    payload = {
        "user_id": user_id,
        "role" : role,
        "exp" : datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token : str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

# print(generate_token(1,"admin"))
# print(verify_token(generate_token(1,"admin")))