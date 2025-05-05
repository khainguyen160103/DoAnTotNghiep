from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.dayoff_services import DayoffServices
from app.middleware import AuthMiddleware
import uuid

Bpdayoff = Blueprint('dayoff', __name__)
 
@Bpdayoff.route('/<id>', methods=['GET'])
@jwt_required()
def get_dayoff(id):
     admin_check = AuthMiddleware.adminRequired()
     if admin_check: 
         return admin_check
     response  = DayoffServices.get_dayoff_by_id(id)
     return response
 
@Bpdayoff.route('/add', methods=['POST'])
@jwt_required()
def add_dayoff():
     admin_check = AuthMiddleware.adminRequired()
     if admin_check: 
         return admin_check
    
     data = request.get_json()
     data['id'] = str(uuid.uuid4())
     return DayoffServices.add_dayoff(data)
 
@Bpdayoff.route('/update', methods=['PATCH'])
@jwt_required()
def update_dayoff():
     admin_check = AuthMiddleware.adminRequired()
     if admin_check: 
         return admin_check
     data = request.get_json()
     
     return DayoffServices.update_dayoff(data)