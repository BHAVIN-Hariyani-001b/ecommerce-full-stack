from app.db import db
from enum import Enum as pyEnum
from sqlalchemy import Enum as saEnum
from sqlalchemy.orm import validates
import re
import uuid
from argon2 import PasswordHasher

ph = PasswordHasher()  ## use password hash


class userRole(pyEnum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(saEnum(userRole), default=userRole.USER, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    @validates("username")
    def validate_username(self, key, username):
        username = username.strip()

        if not (3 < len(username) <= 80):
            raise ValueError("Username must be between 3 and 80 characters.")
        if not re.match(r"^[a-zA-Z_.-]+$", username):
            raise ValueError("Username may only contain letters, _, ., or -")
        return username

    @validates("phone")
    def validate_phone(self, key, phone):
        if not phone:
            return phone

        phone = re.sub(r"[\s\-\(\)]", "", phone)

        if not phone.startswith("+91"):
            raise ValueError("Phone number must start with +91")

        number = phone[3:]
        if len(number) != 10:
            raise ValueError("Enter 10 digit after +91")

        # India-friendly + generic
        if not re.match(r"^\+[1-9]\d{7,14}$", phone):
            raise ValueError("Invalid phone number")        
        print(phone)
        return phone

    @validates("email")
    def validates_email(self, key, email):
        email = email.strip().lower()
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, email):
            raise ValueError("Invalid email format")

        return email

    def set_password(self, raw_password):
        raw_password = str(raw_password).strip()

        errors = []

        if len(raw_password) < 8:
            errors.append("at least 8 characters")

        if not re.search(r"[A-Z]", raw_password):
            errors.append("one uppercase letter")

        if not re.search(r"[a-z]", raw_password):
            errors.append("one lowercase letter")

        if not re.search(r"\d", raw_password):
            errors.append("one digit")

        if not re.search(r"[^\w\s]", raw_password):
            errors.append("one special character")

        if errors:
            raise ValueError(f"Password must contain: {', '.join(errors)}")

        # Hash password
        self.password = ph.hash(raw_password)

    def check_password(self, raw_password):
        return ph.verify(self.password, raw_password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "role": self.role.value,
            "created_at": self.timestamp.isoformat(),
        }

    def to_dict__(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "role": self.role.value,
            "password": self.password,
            "created_at": self.timestamp.isoformat(),
        }

    def to_dict_(self):
        return {
            "username": self.username,
            "email": self.email,
            "role": self.role.value,
            "created_at": self.timestamp.isoformat(),
        }
