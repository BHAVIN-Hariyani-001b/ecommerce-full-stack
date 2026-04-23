from flask import Blueprint,jsonify,request
from app.models.users import User 
from app.db import db
from sqlalchemy.exc import IntegrityError

auth_dp = Blueprint('auth',__name__)

# login route
@auth_dp.route("/login",methods=["POST"])
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

    return jsonify({
        "message" : "Login successful",
        "user" : user.to_dict()
    }),200

# register route
@auth_dp.route("/register",methods=["POST"])
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
        print(User.query.all())

        return jsonify({
            "message": "User registered successfully",
            "user": user.to_dict()
        }), 201

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 422

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 409