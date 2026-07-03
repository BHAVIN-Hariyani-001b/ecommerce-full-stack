from app.db import db

class Attributes(db.Model):
    __tablename__ = 'attributes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'value': self.value
        }