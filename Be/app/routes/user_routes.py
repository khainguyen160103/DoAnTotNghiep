from flask import Blueprint, request ,jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


from app.services import UserSerives
from app.middleware import AuthMiddleware

bpUser = Blueprint('user',__name__)

# create user
@bpUser.route('/',methods=['POST']) 
@jwt_required()
def createUser(): 
    admin_check = AuthMiddleware.adminRequired()
    if admin_check: 
        return admin_check
    data = request.get_json()
    response = UserSerives.create_user(data)
    return response

# get all user
@bpUser.route('/',methods = ['GET'])
@jwt_required()
def getAllUser(): 
    admin_check = AuthMiddleware.adminRequired()
    if admin_check: 
        return admin_check
    response = UserSerives.get_all_user()
    return response
    
@bpUser.route('/<id>', methods=['PATCH'])
@jwt_required()
def deleteUser(id): 
    admin_check = AuthMiddleware.adminRequired()
    if admin_check: 
        return admin_check
    response = UserSerives.delete_user(id)
    return response

# search information
@bpUser.route('/<id>/', methods=['GET'])
@jwt_required()
def getUser(id): 
    response = UserSerives.get_user_by_id(id)
    return response

@bpUser.route('/me' , methods=["POST"])
@jwt_required()
def get_me(): 
    identity = get_jwt_identity()
    print('identity',identity)
    response = UserSerives.get_user_by_id(identity)
    return response
    