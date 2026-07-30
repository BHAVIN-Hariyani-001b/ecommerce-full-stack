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
    JWT_ACCESS_TOKEN_EXPIRES  = timedelta(minutes=15)  
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    JWT_ALGORITHM = "HS256"

    # token location - access from header , refresh from cookie 
    JWT_TOKEN_LOCATION        = ["headers", "cookies"]
    JWT_HEADER_NAME            = "Authorization"
    JWT_HEADER_TYPE            = "Bearer"

    IS_PRODUCTION              = os.getenv('FLASK_ENV') == 'production'
    JWT_COOKIE_SECURE          = IS_PRODUCTION
    JWT_COOKIE_SAMESITE        = "Lax"
    JWT_COOKIE_CSRF_PROTECT    = IS_PRODUCTION
    JWT_ACCESS_COOKIE_PATH     = "/"                    # fixed: no trailing spaces
    JWT_REFRESH_COOKIE_PATH    = "/api/auth/refresh"    # fixed: matches url_prefix

    ## mail send 
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.getenv('MAIL_USER_NAME')
    MAIL_PASSWORD= os.getenv('GMAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_USER_NAME')

    # File upload configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 5 MB max file size
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../frontend/public/image')

    # FORONTEND URL for CORS
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
