from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    verify_jwt_in_request,
    get_jwt_identity,
    jwt_required,
    set_refresh_cookies,
    set_access_cookies,
    get_jwt,
)
from app.models.users import User
from app.db import db
from sqlalchemy.exc import IntegrityError
from app.util.auth_middleware import login_required

auth_bp = Blueprint("auth", __name__)


# login route
@auth_bp.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        required = ["email", "password"]
        missing = [f for f in required if not data.get(f)]

        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
        
        user = User.query.filter_by(email=data["email"]).first()

        if not user and not user.check_password(data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401
        elif not user:
            return jsonify({"error": "Invalid email or password"}), 401
        elif not user.check_password(data["password"]):
            return jsonify({"error": "Invalid password"}), 401

        claims = {"role": user.role.value}

        access_token = create_access_token(
            identity=str(user.id), additional_claims=claims
        )

        refresh_token = create_refresh_token(
            identity=str(user.id), additional_claims=claims
        )

        response = jsonify(
            {
                "message": "Login successful",
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "role": user.role.value,
                },
            }
        )

        print(response)

        set_access_cookies(response,access_token)
        set_refresh_cookies(response,refresh_token)
        
        return response, 200

    except Exception as e:
        return jsonify({"error": "Login failed, please try again"}), 500


# register route
@auth_bp.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    print(data)
    required = ["username", "email", "password"]
    missing = [f for f in required if not data.get(f)]

    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 409

    try:
        user = User(
            username=data["username"], email=data["email"], phone=data.get("phone")
        )
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()

        token = create_access_token(
            identity=str(user.id), additional_claims={"role": user.role.value}
        )

        return (
            jsonify(
                {
                    "message": "Registered successfully",
                    "user": {
                        "id": str(user.id),
                        "username": user.username,
                        "email": user.email,
                        "role": user.role.value,
                    },
                }
            ),
            201,
        )

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 422

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 409


@auth_bp.route("/auth/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logged out successfully"})

    response.delete_cookie(
        "refreshToken", path="/auth/refresh", httponly=True, samesite="Strict"
    )

    return response, 200


@auth_bp.route("/auth/refresh", methods=["POST"])
@jwt_required(refresh=True, locations=["cookies"])
def refresh():
    try:
        identity = get_jwt_identity()
        claims = get_jwt()

        new_access_token = create_access_token(
            identity=identity, additional_claims={"role": claims["role"]}
        )

        return jsonify({"token": new_access_token}), 200

    except Exception as e:
        return jsonify({"error": "Token refresh failed"}), 401


@auth_bp.route("/auth/profile", methods=["GET"])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/auth/verify", methods=["GET"])
@jwt_required()
def verify():
    claims = get_jwt()
    user_id = get_jwt_identity()

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User Not Found"}), 404

    return jsonify({"valid": True, "role": claims.get("role"), "id": user_id}), 200
