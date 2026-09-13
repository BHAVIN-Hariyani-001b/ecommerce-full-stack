from app.db import db
from app.models.product import Products
from app.models.AttributeValue import AttributeValue
from sqlalchemy import Enum as saEnum
from enum import Enum as pyEnum
import uuid


class OrderStatus(pyEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Orders(db.Model):

    __tablename__ = "orders"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    address_id = db.Column(
        db.String(36), db.ForeignKey("user_address.id"), nullable=False
    )
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(saEnum(OrderStatus), default=OrderStatus.PENDING, nullable=False)

    create_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship("User", back_populates="orders")
    address = db.relationship("UserAddress", back_populates="orders")
    payments = db.relationship("Payment", back_populates="orders")
    order_item = db.relationship("OrderItem", back_populates="order")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user": (
                {
                    "id": self.user.id,
                    "username": self.user.username,
                    "email": self.user.email,
                    "phone": self.user.phone,
                }
                if self.user
                else None
            ),
            "address": self.address.to_dict() if self.address else None,
            "status": self.status.value,
            "total_amount": float(self.total_amount),
            "create_at": self.create_at.isoformat() if self.create_at else None,
            "order_item": [i.to_dict() for i in self.order_item],
        }

    def to_dict_(self):
        return {
            "Name": self.user.username,
            "OrderId": f"#ORD-{self.id[:8].upper()}",
            "OrderMrp": self.total_amount,
            "OrderStatus": self.status.value,
        }
