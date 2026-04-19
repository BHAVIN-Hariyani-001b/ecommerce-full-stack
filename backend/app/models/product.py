from app.db import db

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(120),nullable=False)
    price = db.Column(db.Float,nullable=False)
    discount = db.Column(db.Integer,default=0)
    category_id = db.Column(db.Integer,db.ForeignKey("category.id"),nullable=True)
    category = db.relationship('Category', backref='product')
    gender = db.Column(db.Integer)
    created_at = db.Column(db.DateTime,server_default=db.func.now())

    images = db.relationship(
        'ProductImage',
        backref='product',
        cascade='all, delete-orphan'
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'category_id' : self.category_id,
            'discount': self.discount,
            'category' : str(self.category.name) if self.category else None,
            'image' : next(
                (img.image_url for img in self.images if img.is_primary),
                None
            ),
            'images' : [img.to_dict() for img in self.images],
        }