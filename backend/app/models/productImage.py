from app.db import db


class ProductImage(db.Model):
    __tablename__ = 'product_images'
    id = db.Column(db.Integer,primary_key=True)
    product_id = db.Column(db.Integer,db.ForeignKey('product.id'),nullable=False)
    image_url = db.Column(db.String(500),nullable=False)
    is_primary = db.Column(db.Boolean,default=False)
    order = db.Column(db.Integer,default=0)

    def to_dict(self):
        return {
            'id' : self.id,
            'product_id' : self.product_id,
            'image_url' : self.image_url,
            'is_primary' : self.is_primary,
            'order' : self.order,
        }