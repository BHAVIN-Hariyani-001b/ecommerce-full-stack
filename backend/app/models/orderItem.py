from app.db import db
from app.models.orders import Orders
import uuid


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False)
    attribute_id = db.Column(db.String(255), nullable=False)
    qty = db.Column(db.Integer, nullable=False, default=1)
    price_at_purchase = db.Column(db.Numeric(10, 2), nullable=False)

    product = db.relationship("Products", back_populates="orders_item")
    order = db.relationship("Orders", back_populates="order_item")

    def to_dict(self):
        return {
            "id": self.id,
            "product": self.product.to_dict_wish(),
            "attribute_id": self.attribute_id,
            "qty": self.qty,
            "price_at_purchase": str(self.price_at_purchase),
            "line_total": str(self.qty * self.price_at_purchase),
        }
