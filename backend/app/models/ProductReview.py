from app.db import db
from uuid import uuid4
from sqlalchemy import CheckConstraint
from app.models.users import User


class ProductReview(db.Model):
    __tablename__ = "product_review"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", backref="reviews")
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False)
    product = db.relationship("Products", backref="reviews")
    product_rating = db.Column(db.Numeric(3, 2), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    userLike = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    __table_args__ = (
        CheckConstraint(
            "product_rating >= 0 AND product_rating <= 5",
            name="check_rating_range",
        ),
    )


    def count_rating(self,rat):
        return 

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user.username,
            "product_id": self.product_id,
            "product_rating": float(self.product_rating),
            "comment": self.comment,
            "date": self.created_at.isoformat() if self.created_at else None,
        }

    def to_dict__(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user.username,
            "product_id": self.product_id,
            "product_rating": (
                0 if float(self.product_rating) == None else float(self.product_rating)
            ),
            "Like": 0 if self.userLike == None else self.userLike,
            "comment": self.comment,
            "date": self.created_at.isoformat() if self.created_at else None,
            "rating" : {

            }
        }
