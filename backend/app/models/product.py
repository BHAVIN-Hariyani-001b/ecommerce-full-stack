from app.db import db
import uuid
from sqlalchemy import Enum as saEnum
from sqlalchemy import Numeric
from enum import Enum as pyEnum
from collections import defaultdict

def get_grouped_attributes(self):
    grouped = defaultdict(list)
    for attr in self.attributes:
        grouped[attr.type].append(attr.to_dict())
    return dict(grouped)

class Gender(pyEnum):
    MALE = "male"
    FEMALE = "female"
    KID = "kid"
    UNISEX = "unisex"
 
class Status(pyEnum):
    PRIVATE = "private"
    PUBLIC = "public"

class Products(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255),nullable=False)

    Base_price = db.Column(Numeric(10, 2),nullable=False)
    Product_price = db.Column(Numeric(10, 2),nullable=False)

    sku = db.Column(db.String(36), unique=True, nullable=False)
    qty = db.Column(db.Integer,default=0)
    discount = db.Column(db.Integer,default=0)

    category_id = db.Column(db.Integer,db.ForeignKey("category.id"),nullable=True)
    category = db.relationship('Category', backref='products',foreign_keys=[category_id])

    subcategory_id = db.Column(db.Integer,db.ForeignKey("category.id"),nullable=True)
    subcategory = db.relationship("Category",foreign_keys=[subcategory_id])

    description = db.Column(db.Text, nullable=True)
    aboutItem = db.Column(db.Text, nullable=True)

    gender = db.Column(saEnum(Gender),default=Gender.UNISEX,nullable=False)

    status = db.Column(saEnum(Status),default=Status.PUBLIC,nullable=False)
    isFrotPage = db.Column(db.Boolean,default=False,nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    images = db.relationship(
        'ProductImage',
        backref='product',
        cascade='all, delete-orphan'
    )

    attributes = db.relationship(
        'ProductAttribute',
        backref='product',
        cascade='all, delete-orphan'        
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'BPrice': float(self.Base_price),
            'PPrice': float(self.Product_price),
            'sku': self.sku,
            'qty': self.qty,
            'aboutItem' : self.aboutItem,
            'description': self.description,
            'gender': self.gender.value,
            'status': self.status.value,
            'category_id' : self.category_id,
            'category' : str(self.category.name) if self.category else None,
            'subcategory_id' : self.subcategory_id,
            'SubCategory' : str(self.subcategory.name) if self.subcategory else None,   
            'discount': self.discount,
            'attributes' : [attr.to_dict() for attr in self.attributes],
            'image' : next(
                (img.to_dict() for img in self.images if img.is_primary),
                None
            ),
            'images' : [img.to_dict() for img in self.images if not img.is_primary],            
        }

    def to_dictt(self):
        return {
            'id': self.id,
            'name': self.name,
            'BPrice': float(self.Base_price),
            'PPrice': float(self.Product_price),
            'discount': self.discount,
            'category': str(self.category.name) if self.category else None,
            'SubCategory': str(self.subcategory.name) if self.subcategory else None,
            'image': next(
                (img.to_dict() for img in self.images if img.is_primary),
                None
            ),
        }