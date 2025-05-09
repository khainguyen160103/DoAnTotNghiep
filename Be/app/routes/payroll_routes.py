from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import uuid
from datetime import date

from app.middleware import AuthMiddleware
from app.services import PayrollService

bpPayroll = Blueprint('payroll', __name__)

# Create salary entry
@bpPayroll.route('/create', methods=['POST'])
@jwt_required()
def create_salary():
    # Admin check
    admin_check = AuthMiddleware.adminRequired()
    if admin_check:
        return admin_check
        
    data = request.get_json()
        
    response = PayrollService.create_salary(data)
    return response

# Update salary information
@bpPayroll.route('/update', methods=['PATCH'])
@jwt_required()
def update_salary():
    # Admin check
    admin_check = AuthMiddleware.adminRequired()
    if admin_check:
        return admin_check
        
    data = request.get_json()
    response = PayrollService.update_salary(data)
    return response

# Get salary information by ID
@bpPayroll.route('/<id>', methods=['GET'])
@jwt_required()
def get_salary(id):
    response = PayrollService.get_salary_by_id(id)
    return response

# Get salary information for a specific employee
@bpPayroll.route('/employee/<employee_id>', methods=['GET'])
@jwt_required()
def get_employee_salary(employee_id):
    response = PayrollService.get_salary_by_employee_id(employee_id)
    return response

# Get all salaries (admin only)
@bpPayroll.route('/all', methods=['GET'])
@jwt_required()
def get_all_salaries():
    # Admin check
    admin_check = AuthMiddleware.adminRequired()
    if admin_check:
        return admin_check
        
    response = PayrollService.get_all_salaries()
    return response

# Generate salary slip
@bpPayroll.route('/slip', methods=['POST'])
@jwt_required()
def generate_salary_slip():
    data = request.get_json()
    employee_id = data.get('employee_id')
    month = data.get('month')
    year = data.get('year')
    
    if not all([employee_id, month, year]):
        return jsonify({
            "message": "Missing required parameters: employee_id, month, year",
            "status": 400
        }), 400
        
    response = PayrollService.generate_salary_slip(employee_id, month, year)
    return response

# Process payroll using existing payroll model
@bpPayroll.route('/process-payroll', methods=['POST'])
@jwt_required()
def process_payroll():
    # Admin check
    admin_check = AuthMiddleware.adminRequired()
    if admin_check:
        return admin_check
        
    data = request.get_json()
    if not data.get('employee_id') or not data.get('month') or not data.get('year'):
        return jsonify({
            "message": "Missing required parameters: employee_id, month, year",
            "status": 400
        }), 400
    
    response = PayrollService.process_payroll(data)
    return response


@bpPayroll.route('/allowance/<employee_id>/<month>/<year>', methods=['GET'])
def get_allowances(employee_id, month, year):
    response = PayrollService.get_allowances_by_employee_month(employee_id, month, year)
    return response

@bpPayroll.route('/deduction/<employee_id>/<month>/<year>', methods=['GET'])
def get_deductions(employee_id, month, year):
    response = PayrollService.get_deductions_by_employee_month(employee_id, month, year)
    return response