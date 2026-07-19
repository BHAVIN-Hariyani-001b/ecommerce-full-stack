from app.db import db
import uuid

class AttributeValue(db.Model):
    """
    One attribute value assigned to one product.
    a_id -> which attribute (size, color, ...)
    p_id -> which product
    value -> the actual entered/selected value, e.g. "XL", "#111"
    """
    __tablename__ = 'attribute_values'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    a_id = db.Column(db.String(36), db.ForeignKey('attributes.id'), nullable=False)
    p_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    value = db.Column(db.String(255), nullable=False)

    attribute = db.relationship('Attribute', back_populates='values')

    def to_dict(self):
        return {
            'id': self.id,
            'a_id': self.a_id,
            'p_id': self.p_id,
            'name': self.attribute.name if self.attribute else None,
            'value': self.value
        }
