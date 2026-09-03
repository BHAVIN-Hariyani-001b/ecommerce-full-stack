from app.db import db
import uuid
from app.models.users import User
from enum import Enum as pyEnum

class UserAddress(db.Model):
    __tablename__ = "user_address"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    userfullname = db.Column(db.String(100), nullable=True)
    location_type = db.Column(
        db.String(30),
        nullable=False,
        default="home",
    )
    street_area = db.Column(db.String(256), nullable=True)
    city = db.Column(db.String(36), nullable=True)
    state = db.Column(db.String(50), nullable=True)
    pin_code = db.Column(db.String(6), nullable=True)
    isPrimary = db.Column(db.Boolean, default=False, nullable=False)

    user = db.relationship(
        "User", backref=db.backref("user_address", passive_deletes=True)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "userfullname": self.userfullname,
            "location_type": self.location_type,
            "street_area": self.street_area,
            "city": self.city,
            "state": self.state,
            "pin_code": self.pin_code,
            "isPrimary": self.isPrimary,
        }
