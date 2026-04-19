from flask import Flask
from dotenv import load_dotenv
from app.routes.auth_routes import auth_dp
from app.routes.product_routes import product_bp
from flask_cors import CORS
from app.db import db
from app.models.productImage import ProductImage
from app.models.category import Category
from app.models.product import Product

import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    # configure the database URI

    # app.config.from_object(config)
    app.secret_key = os.getenv("SECRET_KEY")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATA_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # register blueprints
    app.register_blueprint(auth_dp,url_prefix='/api')
    app.register_blueprint(product_bp,url_prefix='/api')
    # initialize the database
    db.init_app(app)

    return app