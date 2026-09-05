from app.db import db
import uuid

class Wishlist(db.Model):
    __tablename__ = "wishlists"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user = db.relationship("User", back_populates="wishlists")
    product = db.relationship("Products", back_populates="wishlists")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product": self.product.to_dict_wish() if self.product else None,
            "product_id" : self.product_id
        }