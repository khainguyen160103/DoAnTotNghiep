from flask import request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity


from app.middleware import AuthMiddleware
from app.services import AttendanceService

bpAttendance = Blueprint('attendance', __name__)

@bpAttendance.route('/attendance', methods=['POST'])
@jwt_required()
def attendance(): 
    admin_check = AuthMiddleware.adminRequired()
    if admin_check: 
        return admin_check
    
    data = request.get_json()
    response = AttendanceService.upload_attendance_file(data)
    return response
