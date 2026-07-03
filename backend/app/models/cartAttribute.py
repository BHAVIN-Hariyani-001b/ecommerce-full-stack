# from app.db import db
# import uuid


# class CartAttribute(db.Model):
#     __tablename__ = "cart_attribute"
#     id = db.Column(db.String(36),primary_key=True,default=lambda:str(uuid.uuid4()))
#     cart_id    = db.Column(db.String(36), db.ForeignKey("cart.id"), nullable=False)
#     attr_type  = db.Column(db.String(50), nullable=False)    
#     attr_value = db.Column(db.String(100), nullable=False) 
#     created_at = db.Column(db.DateTime, server_default=db.func.now())

#     def to_dict():
#         return {
            
#         }

    