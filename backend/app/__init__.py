from flask import Flask
from app.routes.auth_routes import auth_dp
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    # configure the database URI
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATA_URL", None)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = os.getenv("SECRET_KEY", None)

    # register blueprints
    app.register_blueprint(auth_dp)
    # initialize the database
    db.init_app(app)

    return app