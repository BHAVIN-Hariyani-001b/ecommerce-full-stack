from flask import Flask, jsonify
from flask_cors import CORS
from app.db import db
from app.models.productImage import ProductImage
from app.models.category import Category
from app.models.product import Products
from app.models.Attribute import Attribute
from app.models.AttributeValue import AttributeValue
from app.models.ForgotPassword import ForgotPassword
from app.models.ProductReview import ProductReview
from app.config import Config
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from app.extensions import mail

BLOCKLIST = set()

def create_app():
    app = Flask(__name__)
    # configure the database URI
    app.config.from_object(Config)

    ## migrate the db if any change in db model and manage
    Migrate(app,db)
    # Mail(ap)
    # app.secret_key = os.getenv("SECRET_KEY")
    # app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATA_URL')
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app,
        resources={r"/api/*": {"origins": app.config['FRONTEND_URL']}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"])
    
    # Initialize JWT Manager
    # works with flask_jwt_extended 
    # and identifies the user and role from the token and provide access to protected routes
    jwt_manager = JWTManager(app)

    @jwt_manager.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLOCKLIST

    @jwt_manager.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        return jsonify({"success": False, "message": "Token has expired"}), 401

    @jwt_manager.invalid_token_loader
    def invalid_token_response(error):
        return jsonify({"success": False, "message": "Invalid token"}), 401

    @jwt_manager.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401

    @jwt_manager.revoked_token_loader
    def revoked_token_response(jwt_header, jwt_payload):
        return jsonify({"success": False, "message": "Token has been revoked"}), 401
    
    # Configure file upload settings
    # app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max file size
    # app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), '../../frontend/public/image')

    # import blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.product_routes import product_bp
    from app.routes.category_routes import category_bp
    from app.routes.cart_routes import cart_bp
    from app.routes.search_routes import search_bp
    from app.routes.mail_send_route import auth_forgot_password_bp
    from app.routes.brand_route import brand_bp
    from app.routes.attributes_routes import attributes_bp
    from app.routes.user_route import user_bp
    from app.routes.product_review_route import product_review_bp

    # register blueprints
    app.register_blueprint(auth_bp,url_prefix='/api')
    app.register_blueprint(product_bp,url_prefix='/api')
    app.register_blueprint(category_bp,url_prefix='/api')
    app.register_blueprint(cart_bp,url_prefix='/api')
    app.register_blueprint(search_bp,url_prefix="/api")
    app.register_blueprint(auth_forgot_password_bp,url_prefix="/api")
    app.register_blueprint(brand_bp,url_prefix="/api")
    app.register_blueprint(attributes_bp,url_prefix="/api")
    app.register_blueprint(user_bp,url_prefix="/api")
    app.register_blueprint(product_review_bp,url_prefix="/api")

    # initialize the database
    db.init_app(app)
    mail.init_app(app)

    # Auto-create tables if not exists
    # with app.app_context():
        # db.create_all()

    return app