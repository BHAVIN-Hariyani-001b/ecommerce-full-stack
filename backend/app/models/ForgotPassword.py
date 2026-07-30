from app.db import db


class ForgotPassword(db.Model):
    __tablename__ = "forgot_password"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    user_id = db.Column(db.String(36),db.ForeignKey('users.id'),nullable=False)
    otp = db.Column(db.String(6), nullable=True)
    otp_expiry = db.Column(db.DateTime, nullable=True)
    otp_attempts = db.Column(db.Integer, default=0)
    otp_verified = db.Column(db.Boolean, default=False, nullable=False)

    user = db.relationship('User', backref='forgot_passwords')

    