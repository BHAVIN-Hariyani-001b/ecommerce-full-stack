from flask import Blueprint,jsonify,request
from flask_jwt_extended import create_access_token , verify_jwt_in_request, get_jwt_identity, jwt_required,get_jwt
from app.models.users import User 
from app.db import db
from sqlalchemy.exc import IntegrityError
from app.util.auth_middleware import login_required

auth_bp = Blueprint('auth',__name__)

# login route
@auth_bp.route("/auth/login",methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    required = ["email","password"]
    missing = [f for f in required if not data.get(f)]

    if missing:
        return jsonify({"error":f"Missing fields: {', '.join(missing)}"}),400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({"error" : "Invalid email or password"}),401
    
    if not user.check_password(data['password']):
        return jsonify({"error" : "Invalid password"}), 401
    
    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.value}
    )

    return jsonify({
        "message" : "Login successful",
        "token" : token,
        "user": {
            "id":       str(user.id),
            "username": user.username,
            "email":    user.email,
            "role":     user.role.value
        }
    }),200

# register route
@auth_bp.route("/auth/register",methods=["POST"])
def register():
    data =  request.get_json()
    print(data)
    required = ["username", "email", "password"]
    missing = [f for f in required if not data.get(f)]

    if missing:
        return jsonify({"error":f"Missing fields: {', '.join(missing)}"}),400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error" : "Email already exists"}),409
    
    try:
        user = User(username=data['username'],email=data['email'],phone=data.get('phone'))
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()

        token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role.value}
        )

        return jsonify({
            "message": "Registered successfully",
            "token": token,
            "user": {
                "id":       str(user.id),
                "username": user.username,
                "email":    user.email,
                "role":     user.role.value
            }
        }), 201

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 422

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 409
    
@auth_bp.route("/auth/profile",methods=["GET"])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = db.session.get(User,user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "user": user.to_dict()
    }), 200

@auth_bp.route('/auth/verify', methods=['GET'])
@jwt_required()
def verify():
    claims = get_jwt()
    user_id =  get_jwt_identity()

    user = db.session.get(User,user_id)

    if not user:
        return jsonify({"error" : "User Not Found"}),404

    return jsonify({
        "valid":True,
        "role": claims.get("role"),
        "id": user_id
    }), 200
