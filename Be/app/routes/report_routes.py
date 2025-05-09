from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.report_services import ReportService
from app.middleware import AuthMiddleware

bpReport = Blueprint('report', __name__)

@bpReport.route('/attendance', methods=['POST'])
@jwt_required()
def get_attendance_report():
    # Admin check
    admin_check = AuthMiddleware.adminRequired()
    if admin_check:
        return admin_check

    # Get data from JSON request
    data = request.get_json()
    month = data.get('month')
    year = data.get('year')
    employee_id = data.get('employee_id')
    
    return ReportService.generate_attendance_report(month, year, employee_id)

@bpReport.route('/salary', methods=['POST'])
@jwt_required()
def get_salary_report():
    # Admin check
    admin_check = AuthMiddleware.adminRequired()
    if admin_check:
        return admin_check

    # Get data from JSON request
    data = request.get_json()
    month = data.get('month')
    year = data.get('year')
    department = data.get('department')
    
    return ReportService.generate_salary_report(month, year, department)

@bpReport.route('/late', methods=['POST'])
@jwt_required()
def get_late_report():
    # Admin check
    admin_check = AuthMiddleware.adminRequired()
    if admin_check:
        return admin_check

    # Get data from JSON request
    data = request.get_json()
    month = data.get('month')
    year = data.get('year')
    threshold = data.get('threshold', 15)  # Default 15 minutes
    
    return ReportService.generate_late_report(month, year, threshold)
