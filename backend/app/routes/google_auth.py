from flask import Blueprint, request, jsonify,current_app
from google.oauth2 import id_token
from app.routes.auth_routes import build_auth_response
from google.auth.transport import requests as google_requests
from app.models.users import User
from sqlalchemy import select
from app.db import db
from app.config import Config
import re

google_auth = Blueprint("gauth", __name__)


def make_valid_username(name, email):
    # Try the Google name first, then the email prefix
    for source in (name, email.split("@")[0]):
        if not source:
            continue
        cleaned = source.strip().replace(" ", "_")
        cleaned = re.sub(r"[^A-Za-z_.\-]", "", cleaned)   # drop digits, emojis, non-latin, etc.
        cleaned = cleaned.strip("_.-")
        if cleaned:
            return cleaned[:80]                            # column is String(80)
    return "user"

@google_auth.route("/auth/google", methods=["POST"])
def google_login():
    token = (request.get_json() or {}).get("idToken")

    if not token:
        return jsonify({"message": "idToken required"}), 400

    try:
        info = id_token.verify_oauth2_token(
            token, google_requests.Request(), Config.GOOGLE_CLIENT_ID
        )
    except ValueError:
        return jsonify({"message": "Invalid Google token"}), 401

    if not info.get("email_verified"):
        return jsonify({"message": "Google email not verified"}), 400

    google_id = info["sub"]
    email = info["email"].lower()

    try:
        user = db.session.scalar(select(User).where(User.google_id == google_id))

        if not user:
            user = db.session.scalar(select(User).where(User.email == email))

            if user:
                user.google_id = google_id
            else:
                user = User(
                    username=make_valid_username(info.get("name"), email),
                    email=email,
                    google_id=google_id,
                    password=None,  
                )
                db.session.add(user)

            db.session.commit()

    except Exception:
        db.session.rollback()
        current_app.logger.exception("Google login DB error")
        return jsonify({"message": "Google login failed, please try again"}), 500

    return build_auth_response(user, "Google login successful")

