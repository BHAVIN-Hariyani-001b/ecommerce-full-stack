from app.db import db
from app.models.category import Status

class Attributes(db.Model):
    __tablename__ = 'attributes_'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=True)  
    status = db.Column(db.Enum(Status), nullable=True, default=Status.ACTIVE)  # New status column
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'value': self.value,
            'type': self.type,
            'status': self.status
        }