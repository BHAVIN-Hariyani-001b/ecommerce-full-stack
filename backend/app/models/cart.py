from app.db import db
import uuid

class Cart(db.Model):
    __tablename__ = "cart"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False)
    qty = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship("User", backref=db.backref("cart", passive_deletes=True))
    product = db.relationship("Products", backref="cart")
    values = db.relationship("CartValue",back_populates="cart", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "cart_id": self.id,
            "qty": self.qty,
            "id": self.product_id,
            "BTotalAmount": self.qty * self.product.Base_price if self.product else 0,
            "PTotalAmount": (
                self.qty * self.product.Product_price if self.product else 0
            ),
            "product": self.product.to_dictt() if self.product else None,
        }
