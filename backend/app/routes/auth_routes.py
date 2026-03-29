from flask import Blueprint

auth_dp = Blueprint('auth',__name__)

@auth_dp.route("/")
def home():
    return "<h1>Welcome to the Home Page</h1>"

# login route
@auth_dp.route("/login")
def login():
    return "<h1>Login Page</h1>"


# register route
@auth_dp.route("/register")
def register():
    return "<h1>Register Page</h1>"