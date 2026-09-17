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

    order = db.relationship("Orders", back_populates="payment")
    user = db.relationship("User", back_populates="payments")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "user_id": self.user_id,
            "user": self.user.to_dict(),
            "method": self.method.value if self.method else None,
            "status": self.status.value if self.status else None,
            "amount_paid": (
                float(self.amount_paid) if self.amount_paid is not None else 0
            ),
            "amount_refunded": (
                float(self.amount_refunded) if self.amount_refunded is not None else 0
            ),
            "razorpay_order_id": self.razorpay_order_id,
            "razorpay_payment_id": self.razorpay_payment_id,
            "razorpay_refund_id": self.razorpay_refund_id,
            "failure_reason": self.failure_reason,
            "paid_at": self.paid_at.isoformat() if self.paid_at else None,
            "create_at": self.create_at.isoformat() if self.create_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
