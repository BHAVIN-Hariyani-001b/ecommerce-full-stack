from app.db import db
from sqlalchemy import ForeignKey
from app.models.category import Category

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(120),nullable=False)
    price = db.Column(db.Float,nullable=False)
    image = db.Column(db.String(500),nullable=True)
    discount = db.Column(db.Integer,default=0)
    category_id = db.Column(db.Integer,ForeignKey("category.id"),nullable=True)
    category = db.relationship('Category', backref='products')
    created_at = db.Column(db.DateTime,server_default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'category_id' : self.category_id,
            'image': self.image,
            'discount': self.discount,
            'category' : str(self.category.name) if self.category else None
        }