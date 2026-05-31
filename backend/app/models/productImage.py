from app.db import db
import uuid

class ProductImage(db.Model):
    __tablename__ = 'product_images'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False, index=True)

    image_name = db.Column(db.String(100), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    sort_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'id' : self.id,
            'product_id' : self.product_id,
            'image_name' : self.image_name,
            'is_primary' : self.is_primary,
            'order' : self.sort_order,
        }