from functools import wraps
from flask import request, jsonify
from app.util.token import verify_token

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            auth_header = request.headers.get('Authorization')  
            print(auth_header)
            if not auth_header:
                return jsonify({
                    'success': False,
                    'message': 'Token missing'
                }), 401
            
            if not auth_header.startswith('Bearer '):
                return jsonify({
                    'success': False,
                    'message': 'Invalid token format'
                }), 401
            
            token = auth_header.replace('Bearer ', '').strip()

            if not token:
                return jsonify({
                    'success': False,
                    'message': 'Token missing'
                }), 401
            

            payload = verify_token(token)

            if not payload:
                return jsonify({
                    'success': False,
                    'message': 'Invalid or expired token'
                }), 401
            
            request.user_id = payload.get('user_id')
            request.user_role = payload.get('role')
            
            return f(*args, **kwargs)

        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e)
            }), 401
    
    return decorated_function
     