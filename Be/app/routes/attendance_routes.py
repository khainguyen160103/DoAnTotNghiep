from flask import request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity


from app.middleware import AuthMiddleware
from app.services import AttendanceService

bpAttendance = Blueprint('attendance', __name__)


@bpAttendance.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if not file:
        return {'message': 'No file provided'}, 400
    response = AttendanceService.upload_attendance_file(file)
    return response

@bpAttendance.route('/update', methods=['PATCH'])
def upadteAttendance(): 
    data = request.get_json()
    response = AttendanceService.update_attendance(data)
    return response

@bpAttendance.route('/delete/<id>', methods=['DELETE'])
def deleteAttendance(id): 
    response = AttendanceService.delete_attendance(id)
    return response

@bpAttendance.route('/add', methods=['POST'])
def addAttendance(): 
    data = request.get_json()
    response = AttendanceService.add_attendance(data)
    return response

@bpAttendance.route('/allByMonth', methods=['GET'])
def getAllByMonth(): 
    data = request.get_json()
    response = AttendanceService.get_attendance_by_employee_id_and_month_year(data)
    return response
