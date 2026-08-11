from app.db import db
from uuid import uuid4
from sqlalchemy import CheckConstraint
from app.models.users import User


class ProductReview(db.Model):
    __tablename__ = "product_review"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    user = db.relationship("User", backref=db.backref("reviews", passive_deletes=True))
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

    @classmethod
    def count_rating(cls, product_id):
        """return rating summury for product"""
        reviews = cls.query.filter_by(product_id=product_id).all()

        counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        total_review = len(reviews)

        if total_review == 0:
            breakdown = [{"stars": star, "percent": 0} for star in range(5, 0, -1)]
            return {
                "total_review": 0,
                "average_rating": 0,
                "breakdown": breakdown,
            }

        rating_sum = 0

        for review in reviews:
            rating_sum += float(review.product_rating)

            star = round(float(review.product_rating))
            star = max(1, min(5, star))
            counts[star] += 1

        average_rating = round(rating_sum / total_review, 2)

        breakdown = [
            {
                "stars": star,
                "percent": round((counts[star] / total_review) * 100),
            }
            for star in range(5, 0, -1)
        ]

        return {
            "total_review": total_review,
            "average_rating": average_rating,
            "breakdown": breakdown,
        }

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
        }

    def review_to_dict(self):
        return {
            "rating": ProductReview.count_rating(self.product_id),
        }
