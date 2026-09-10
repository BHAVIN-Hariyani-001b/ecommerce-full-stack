from app.db import db
import uuid
from enum import Enum as pyEnum
from sqlalchemy import Enum as saEnum


class PaymentStatus(pyEnum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(pyEnum):
    CARD = "card"
    UPI = "upi"
    COD = "cod"


class Payment(db.Model):
    __tablename__ = "payment"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey("orders.id"), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    method = db.Column(saEnum(PaymentMethod), nullable=False)
    status = db.Column(
        saEnum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING
    )

    amount_paid = db.Column(db.Numeric(10, 2), nullable=False)
    amount_refunded = db.Column(db.Numeric(12, 2), nullable=False, default=0)

    razorpay_order_id = db.Column(db.String(100), unique=True, nullable=True)
    razorpay_payment_id = db.Column(db.String(100), unique=True, nullable=True)
    razorpay_refund_id = db.Column(
        db.String(100), nullable=True, unique=True, index=True
    )

    failure_reason = db.Column(db.String(255), nullable=True)

    paid_at = db.Column(db.DateTime, nullable=True)
    create_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )

    orders = db.relationship("Orders", back_populates="payments")
    user = db.relationship("User", back_populates="payments")
