import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATA_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False