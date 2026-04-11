from app.db import db

class Category(db.Model):
    __tablename__ = 'category' 
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100),nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=True)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(255), nullable=True)
    status = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime,server_default=db.func.now())

    def to_dict(self):
        return {
            'id'          : self.id,
            'name'        : self.name,
            'slug'        : self.slug,
            'description' : self.description,
            'image'       : self.image,
            'status'      : self.status,
        }