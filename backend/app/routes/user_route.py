from flask import Blueprint, jsonify, request
from app.models.users import User
from app.util.admin import admin_required
from app.db import db

user_bp = Blueprint("user", __name__)


@user_bp.route("/user", methods=["GET"])
def user_get():
    """get user for show admin"""
    try:
        users = User.query.all()
        print(users)

        if not users:
            return jsonify({"success": False, "message": "user not found"}), 404

        users_list = [user.to_dict() for user in users]

        return jsonify({"success": True, "data": users_list})

    except Exception:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "An unexpected error occurred.",
                }
            ),
            500,
        )


@user_bp.route("/user", methods=["POST"])
def user_create():
    """create new user"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "All Data Are reqired"}), 400

        required = ["username", "email", "password"]

        missing = [f for f in required if not data.get(f)]

        if missing:
            return jsonify({"message": f"Missing fileds : {', '.join(missing)}"}), 400

        email = data.get("email").strip()

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 409

        user = User(
            username=data.get("username").strip(),
            email=email,
            role=data.get("role").strip(),
        )
        user.set_password(data.get("password").strip())

        db.session.add(user)
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": "User Create Successfully",
                "data": user.to_dict(),
            }
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "message": "An unexpected error occurred to create User",
                    "error": str(e),
                }
            ),
            500,
        )


@user_bp.route("/user/<uuid:id>", methods=["PUT"])
def update_user(id):
    """update product using by id and change admin user data update"""
    try:
        existing = db.session.get(User, str(id))

        if not existing:
            return jsonify({"message": "User Not Found"}), 400

        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "All Data Are reqired"}), 400

        required = ["username", "email"]

        missing = [f for f in required if not data.get(f)]

        if missing:
            return jsonify({"message": f"Missing fileds : {', '.join(missing)}"}), 400

        email = data.get("email").strip()

        email_exists = User.query.filter(
            User.email == email, User.id != existing.id
        ).first()

        if email_exists:
            return jsonify({"error": "Email already exists"}), 409

        existing.email = email
        existing.username = data.get("username").strip()
        existing.role = data.get("role").strip()

        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "User updated successfully",
                    "data": existing.to_dict(),
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "User Not Update"}), 500


@user_bp.route("/user/<uuid:id>", methods=["DELETE"])
def delete_user(id):
    """User Delete Use By Id"""
    try:
        existing = db.session.get(User, str(id))
        print("---------- delete ---------")
        print(existing)

        if not existing:
            return jsonify({"message": "User Not Found"}), 404

        db.session.delete(existing)
        db.session.commit()
        return jsonify(
            {"success": True, "message": "User Delete Successfully", "data": id}
        )
    except Exception as e:
        return jsonify({"success": False, "message": "User Not Delete"})
