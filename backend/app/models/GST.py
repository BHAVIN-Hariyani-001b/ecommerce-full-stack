from app.db import db


class GST(db.Model):
    __tablename__ = "gst"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    gst_rate = db.Column(db.Numeric(5, 2), nullable=False,default=0.00,server_default="0.00")
    is_active = db.Column(db.Boolean, default=True)

    products = db.relationship(
        "Products",
        back_populates="gst"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "gst_rate": self.gst_rate,
            "is_active": self.is_active,
        }
    