from flask import Blueprint,jsonify,request
from app.models.users import User
import random
from datetime import datetime,timedelta
from app.db import db
from flask_mail import Message
from app.extensions import mail
import os


auth_forgot_password_bp = Blueprint('authforgotpassword',__name__)


@auth_forgot_password_bp.route("/auth/forgot-password",methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email')
        print(email)

        if not email:
            return jsonify({"error" : "Email is required "}),400

        user = User.query.filter_by(email=str(email)).first()
        print(user)

        is_prod = os.getenv("FLASK_ENV")
        if not user:
            if is_prod:
                return jsonify({"message": "If this email exists, OTP has been sent"}), 200
            else:
                return jsonify({"error": "No account found with this email"}), 404

        otp = str(random.randint(100000, 999999))
        otp_expiry = datetime.utcnow() + timedelta(minutes=5)


        user.otp = otp
        user.otp_expiry = otp_expiry
        user.otp_attempts = 0

        db.session.commit()

        msg = Message(
            subject = "Your Password Reset OTP",
            recipients = [email],
            body = f"""
            Your OTP for password reset is:{otp} 
            
            This OTP is valid for 5 minutes.
            Do not share this with anyone.
            
            If you didn't request this, ignore this email.
            """
        )
        print(msg)
        
        mail.send(msg)


        return jsonify({"message": "If this email exists, OTP has been sent"}), 200

    except Exception as e:
        print(f"Mail send error: {e}")
        return jsonify({"error": "Failed to send OTP"}), 500

