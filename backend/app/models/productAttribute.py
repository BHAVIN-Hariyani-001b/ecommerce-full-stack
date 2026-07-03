from app.db import db
import uuid

class ProductAttribute(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36),db.ForeignKey('products.id'),nullable=False)
    type = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'product_id' : self.product_id,
            'type' : self.type,
            'value' : self.value
        }   