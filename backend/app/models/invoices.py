from app.db import db
import uuid

class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey("orders.id"), nullable=False,unique=True)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    pdf_path = db.Column(db.String(255), nullable=True)
    file_url = db.Column(db.String(255), nullable=True) 
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    order = db.relationship("Orders", back_populates="invoice")