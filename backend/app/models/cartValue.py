from app.db import db
from app.models.cart import Cart
from app.models.AttributeValue import AttributeValue
import uuid

class CartValue(db.Model):
    __tablename__ = "cart_value"
    id = db.Column(db.String(36), primary_key=True, default=lambda: uuid.uuid4())
    cart_id = db.Column(
        db.String(36), db.ForeignKey("cart.id", ondelete="CASCADE"), nullable=False
    )
    attribute_value_id = db.Column(
        db.String(36), db.ForeignKey("attribute_values.id"), nullable=False
    )

    cart = db.relationship("Cart", back_populates="values")
    attribute_value = db.relationship("AttributeValue")

    def to_dict(self):
        return {
            "id": self.id,
            "cart_id": self.cart_id,
            "attribute_value_id": self.attribute_value_id,
            "a_id": self.attribute_value.a_id if self.attribute_value else None,
            "name": (
                self.attribute_value.attribute.name
                if self.attribute_value and self.attribute_value.attribute
                else None
            ),
            "value": self.attribute_value.value if self.attribute_value else None,
        }
