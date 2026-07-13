from app.db import db
from sqlalchemy import Enum as saEnum
from enum import Enum as pyEnum

class Status(pyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Category(db.Model):
    __tablename__ = 'category' 
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100),nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=True)
    parent_id = db.Column(db.Integer,db.ForeignKey("category.id",ondelete="SET NULL"),nullable=True,index=True)
    description = db.Column(db.Text, nullable=True)
    sort_order = db.Column(db.Integer, nullable=True, default=1)
    image = db.Column(db.String(255), nullable=True)
    status = db.Column(saEnum(Status), default=Status.ACTIVE, nullable=False)
    created_at = db.Column(db.DateTime,server_default=db.func.now())

    parent = db.relationship("Category",remote_side=[id],backref=db.backref("children",lazy=True))

    def to_dict(self):
        return {
            'id'          : self.id,
            'name'        : self.name,
            'slug'        : self.slug,
            'parentCategory': self.parent.name if self.parent else None,
            'description' : self.description,
            'sort_order' : self.sort_order,
            'image'       : self.image,
            'status'      : self.status.value,
        }