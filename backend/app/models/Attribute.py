from app.db import db
import uuid

class Attribute(db.Model):
    """
    Defines an attribute type, e.g. "size" or "color", and how the admin
    form should render it (input_type) with an example placeholder.
    """
    __tablename__ = 'attributes'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False,unique=True)          # e.x. "color", "size"
    example_value = db.Column(db.String(255), nullable=True)    # e.x. "red", "XL"

    values = db.relationship('AttributeValue', back_populates='attribute', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'placeholder': self.example_value
        }
