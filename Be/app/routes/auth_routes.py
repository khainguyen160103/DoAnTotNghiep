from flask import request , jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services import AuthService

from app.middleware import AuthMiddleware

bpAuth = Blueprint(
    'auth',
    __name__
)

# login
@bpAuth.route('/login',methods=['POST'])
def login(): 
    data = request.get_json()
    response  = AuthService.login(data)
    return response

# logout
@bpAuth.route('/logout', methods =['POST'])
def logout(): 
    response = AuthService.logout()
    return response

# update account
@bpAuth.route('/update' , methods=['PATCH'])
@jwt_required()
def update(): 
    admin_check = AuthMiddleware.adminRequired()
    if admin_check: 
        return admin_check
    data = request.get_json()
    response = AuthService.update(data)
    return response

