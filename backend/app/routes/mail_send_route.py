from flask import Blueprint, jsonify, request
from app.models.users import User
from app.models.ForgotPassword import ForgotPassword
import random
from datetime import datetime, timedelta
from app.db import db
from flask_mail import Message
from app.extensions import mail
import os

auth_forgot_password_bp = Blueprint("authforgotpassword", __name__)


@auth_forgot_password_bp.route("/auth/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email")
        print(email)

        if not email:
            return jsonify({"error": "Email is required "}), 400

        user = User.query.filter_by(email=str(email)).first()
        print(user)

        forgotPassword = ForgotPassword.query.filter_by(user_id=str(user.id)).first()
        if not forgotPassword:
            forgotPassword = ForgotPassword(user_id=str(user.id))
            db.session.add(forgotPassword)

        is_prod = os.getenv("FLASK_ENV")
        if not user:
            if is_prod:
                return (
                    jsonify({"message": "If this email exists, OTP has been sent"}),
                    200,
                )
            else:
                return jsonify({"error": "No account found with this email"}), 404

        otp = str(random.randint(1000, 9999))
        otp_expiry = datetime.now() + timedelta(minutes=2)

        forgotPassword.otp = otp
        forgotPassword.otp_expiry = otp_expiry
        forgotPassword.otp_attempts = 0
        forgotPassword.otp_verified = False

        db.session.commit()

        msg = Message(
            subject="Your Password Reset OTP",
            recipients=[email],
            body=f"""
            Your OTP for password reset is:{otp} 
            
            This OTP is valid for 2 minutes.
            Do not share this with anyone.
            
            """,
        )
        print(msg)

        mail.send(msg)

        return jsonify({"message": "If this email exists, OTP has been sent"}), 200

    except Exception as e:
        print(f"Mail send error: {e}")
        return jsonify({"error": "Failed to send OTP"}), 500


@auth_forgot_password_bp.route("/auth/verify-otp", methods=["POST"])
def verify_otp():
    try:
        data = request.get_json()
        email = data.get("email")
        otp = data.get("otp")
        print(data)

        if not email or not otp:
            return jsonify({"error": "Email and OTP are required"}), 400

        user = User.query.filter_by(email=str(email)).first()
        forgotPassword = ForgotPassword.query.filter_by(user_id=str(user.id)).first()

        if not user and not forgotPassword:
            return jsonify({"error": "No account found with this email"}), 404

        if datetime.now() > forgotPassword.otp_expiry:
            return jsonify({"error": "OTP has expired"}), 400

        if forgotPassword.otp_attempts >= 3:
            forgotPassword.otp = None
            forgotPassword.otp_expiry = None
            return jsonify({"error": "Maximum OTP attempts exceeded"}), 400

        if forgotPassword.otp != otp:
            forgotPassword.otp_attempts += 1
            db.session.commit()
            return jsonify({"error": "Invalid OTP"}), 400

        forgotPassword.otp = None
        forgotPassword.otp_attempts = 0
        forgotPassword.otp_verified = True
        db.session.commit()

        return jsonify({"message": "OTP verified successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"OTP verification error: {e}")
        return jsonify({"error": "Failed to verify OTP"}), 500


@auth_forgot_password_bp.route("/auth/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
        email = data.get("email")
        new_password = data.get("newPassword")

        if not email:
            return jsonify({"error": "email are required"}), 400

        if not new_password:
            return jsonify({"error": "new password are required"}), 400

        user = User.query.filter_by(email=str(email)).first()
        forgotPassword = ForgotPassword.query.filter_by(user_id=str(user.id)).first()

        if not user or not forgotPassword.otp_verified:
            return (
                jsonify(
                    {"error": "OTP verification required before resetting password"}
                ),
                400,
            )

        user.set_password(new_password)

        forgotPassword.otp_verified = False
        forgotPassword.otp = None
        forgotPassword.otp_expiry = None
        forgotPassword.otp_attempts = 0

        db.session.commit()

        return jsonify({"message": "Password reset successfully"}), 200

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 422

    except Exception as e:
        db.session.rollback()
        print(f"Reset password error: {e}")
        return jsonify({"error": "Failed to reset password"}), 500
