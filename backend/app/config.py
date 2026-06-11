import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    # Secret key for session management
    SECRET_KEY = os.getenv('SECRET_KEY')

    # database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATA_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    # File upload configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 5 MB max file size
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../frontend/public/image')

    # FORONTEND URL for CORS
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

    JWT_ACCESS_TOKEN_EXPIRES  = timedelta(hours=1)  
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)