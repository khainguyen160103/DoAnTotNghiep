import uuid
from sqlalchemy import extract
from datetime import date
from app.models import Payroll, Employee, Attendance, Deducation , Allowance, PayrollDeducation , PayrollAllowance
from app.schemas import PayrollSchema
from app.extencions import db
from app.utils import Error, Success
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
import decimal, datetime

class PayrollService:
    @staticmethod
    def create_salary(data):
        """Create a new salary entry for an employee"""
        try:
            # Check if employee exists
            employee = Employee.query.get(data['employee_id'])
            if not employee:
                return Error(
                    message="Employee not found",
                    status=404
                ).to_json(), 404
                
            # Generate unique ID
            data['id'] = str(uuid.uuid4())
            
            # Set the updated_at date if not provided
            if 'updated_at' not in data:
                data['updated_at'] = date.today()
                
            # Create new salary record
            schema = PayrollSchema()
            salary = schema.load(data)
            
            db.session.add(salary)
            db.session.commit()
            
            return Success(
                message="Salary information created successfully",
                status=200,
                payload=schema.dump(salary)
            ).to_json(), 200
            
        except SQLAlchemyError as e:
            db.session.rollback()
            return Error(
                message="Database error occurred",
                status=500,
                error=str(e)
            ).to_json(), 500
        except Exception as e:
            return Error(
                message="An error occurred while creating salary information",
                status=400,
                error=str(e)
            ).to_json(), 400

    @staticmethod
    def update_salary(data):
        """Update an employee's salary information"""
        try:
            salary = Payroll.query.get(data['id'])
            if not salary:
                return Error(
                    message="Salary record not found",
                    status=404
                ).to_json(), 404
                
            # Update the updated_at date
            data['updated_at'] = date.today()
            
            # Update salary record
            for key, value in data.items():
                if hasattr(salary, key):
                    setattr(salary, key, value)
            
            db.session.commit()
            
            schema = PayrollSchema()
            return Success(
                message="Salary information updated successfully",
                status=200,
                payload=schema.dump(salary)
            ).to_json(), 200
            
        except SQLAlchemyError as e:
            db.session.rollback()
            return Error(
                message="Database error occurred",
                status=500,
                error=str(e)
            ).to_json(), 500
        except Exception as e:
            return Error(
                message="An error occurred while updating salary information",
                status=400,
                error=str(e)
            ).to_json(), 400

    @staticmethod
    def get_salary_by_id(salary_id):
        """Get salary information by ID"""
        try:
            salary = Payroll.query.get(salary_id)
            if not salary:
                return Error(
                    message="Salary record not found",
                    status=404
                ).to_json(), 404
                
            schema = PayrollSchema()
            return Success(
                message="Salary information retrieved successfully",
                status=200,
                payload=schema.dump(salary)
            ).to_json(), 200
            
        except Exception as e:
            return Error(
                message="An error occurred while retrieving salary information",
                status=400,
                error=str(e)
            ).to_json(), 400

    @staticmethod
    def get_salary_by_employee_id(employee_id):
        """Get salary information for a specific employee"""
        try:
            # Check if employee exists
            employee = Employee.query.get(employee_id)
            if not employee:
                return Error(
                    message="Employee not found",
                    status=404
                ).to_json(), 404
                
            salary_records = Payroll.query.filter_by(employee_id=employee_id).all()
            
            schema = PayrollSchema(many=True)
            return Success(
                message="Salary information retrieved successfully",
                status=200,
                payload=schema.dump(salary_records)
            ).to_json(), 200
            
        except Exception as e:
            return Error(
                message="An error occurred while retrieving salary information",
                status=400,
                error=str(e)
            ).to_json(), 400

    @staticmethod
    def get_all_salaries():
        """Get all salary records"""
        try:
            salaries = Payroll.query.all()
            schema = PayrollSchema(many=True)
            
            return Success(
                message="All salary records retrieved successfully",
                status=200,
                payload=schema.dump(salaries)
            ).to_json(), 200
            
        except Exception as e:
            return Error(
                message="An error occurred while retrieving salary records",
                status=400,
                error=str(e)
            ).to_json(), 400

    @staticmethod
    def generate_salary_slip(employee_id, month, year):
        """Generate a salary slip for an employee"""
        try:
            # Get employee information
            employee = Employee.query.get(employee_id)
            if not employee:
                return Error(
                    message="Employee not found",
                    status=404
                ).to_json(), 404
                
            # Get salary information
            salary = Payroll.query.filter_by(employee_id=employee_id).first()
            if not salary:
                return Error(
                    message="Salary information not found for this employee",
                    status=404
                ).to_json(), 404
                
            # Get attendance information for the month
            attendance_records = Attendance.query.filter(
                Attendance.employee_id == employee_id,
                db.extract('month', Attendance.attendance_date) == month,
                db.extract('year', Attendance.attendance_date) == year
            ).all()
            
            # Calculate total working days
            total_working_days = len(attendance_records)
            
            # Calculate overtime
            total_overtime = sum(record.total_overtime or 0 for record in attendance_records)
            
            # Assume standard working days in a month is 22
            standard_days = 22
            
            # Calculate prorated salary if needed
            if total_working_days < standard_days:
                prorated_factor = decimal.Decimal(total_working_days) / decimal.Decimal(standard_days)
                prorated_salary = decimal.Decimal(str(salary.base_salary)) * prorated_factor
            else:
                prorated_salary = salary.base_salary
                
            # Assume overtime rate is 1.5 times hourly rate
            overtime_hourly_rate = (decimal.Decimal(str(salary.base_salary)) / decimal.Decimal('22') / decimal.Decimal('8')) * decimal.Decimal('1.5')
            overtime_pay = overtime_hourly_rate * decimal.Decimal(str(total_overtime))
            
            # Assume some allowances and deductions for example
            allowances = decimal.Decimal('0')  # This would come from the allowance table
            deductions = decimal.Decimal('0')  # This would come from the deduction table
            
            # Calculate net salary
            net_salary = prorated_salary + overtime_pay + allowances - deductions
            
            # Prepare salary slip data
            salary_slip = {
                'employee_id': employee_id,
                'employee_name': employee.fullname,
                'position': employee.position.name if employee.position else 'N/A',
                'month': month,
                'year': year,
                'base_salary': float(salary.base_salary),
                'working_days': total_working_days,
                'standard_days': standard_days,
                'overtime_hours': total_overtime,
                'overtime_pay': float(overtime_pay),
                'allowances': float(allowances),
                'deductions': float(deductions),
                'prorated_salary': float(prorated_salary),
                'net_salary': float(net_salary)
            }
            
            return Success(
                message="Salary slip generated successfully",
                status=200,
                payload=salary_slip
            ).to_json(), 200
            
        except Exception as e:
            return Error(
                message="An error occurred while generating the salary slip",
                status=400,
                error=str(e)
            ).to_json(), 400

    @staticmethod

    def process_payroll(data):
        """Process payroll using existing payroll models"""
        try:
            # Check if employee exists
            employee = Employee.query.get(data.get('employee_id'))
            if not employee:
                return Error(
                    message="Employee not found",
                    status=404
                ).to_json(), 404
            
            # Get payroll period
            period_month = data.get('month')
            period_year = data.get('year')
            
            if not all([period_month, period_year]):
                return Error(
                    message="Month and year are required for payroll processing",
                    status=400
                ).to_json(), 400
            
            # Get salary information
            # Điều chỉnh truy vấn không sử dụng Salary.effective_date
            salary = Payroll.query.filter_by(employee_id=data.get('employee_id')).first()
            if not salary:
                return Error(
                    message="Salary information not found for this employee",
                    status=404
                ).to_json(), 404
            
            # Create a new payroll entry or find existing one for this period
            # payroll = Payroll.query.filter_by(
            #     employee_id=data.get('employee_id'),
            #     month=period_month,
            #     year=period_year
            # ).first()
            month_date = datetime.date(int(period_year), int(period_month), 1)

            payroll = Payroll.query.filter_by(
                employee_id=data.get('employee_id'),
                month=month_date,
                year=period_year
            ).first()
            # Calculate payroll details based on attendance, allowances, etc.
            # Get attendance information for the month
            attendance_records = Attendance.query.filter(
                Attendance.employee_id == employee.id,
                db.extract('month', Attendance.attendance_date) == period_month,
                db.extract('year', Attendance.attendance_date) == period_year
            ).all()
            
            # Calculate total working days
            total_working_days = len(attendance_records)
            
            # Calculate overtime
            total_overtime = sum(record.total_overtime or 0 for record in attendance_records)
            
            # Standard working days in a month
            standard_days = 22
            
            # Calculate prorated salary if needed
            if total_working_days < standard_days:
                prorated_factor = decimal.Decimal(total_working_days) / decimal.Decimal(standard_days)
                prorated_salary = decimal.Decimal(str(salary.base_salary)) * prorated_factor
            else:
                prorated_salary = decimal.Decimal(str(salary.base_salary))
                
            # Calculate overtime pay
            overtime_hourly_rate = (decimal.Decimal(str(salary.base_salary)) / decimal.Decimal('22') / decimal.Decimal('8')) * decimal.Decimal('1.5')
            overtime_pay = overtime_hourly_rate * decimal.Decimal(str(total_overtime))
            
            # Get allowances from your existing models
            allowance_records = Allowance.query.filter_by(employee_id=employee.id).all()
            total_allowances = sum(decimal.Decimal(str(allowance.amount)) for allowance in allowance_records) if allowance_records else decimal.Decimal('0')
            
            # Get deductions from your existing models
            deduction_records = Deducation.query.filter_by(employee_id=employee.id).all()
            total_deductions = sum(decimal.Decimal(str(deduction.amount)) for deduction in deduction_records) if deduction_records else decimal.Decimal('0')
            
            # Calculate gross and net salary
            gross_salary = prorated_salary + overtime_pay + total_allowances
            net_salary = gross_salary - total_deductions
            
            if not payroll:
                # Create new payroll entry
                payroll = Payroll(
                    id=str(uuid.uuid4()),
                    employee_id=data.get('employee_id'),
                    month=period_month,
                    year=period_year,
                    base_salary=float(salary.base_salary),
                    gross_salary=float(gross_salary),
                    net_salary=float(net_salary),
                    deductions=float(total_deductions),
                    allowances=float(total_allowances),
                    status="processed",
                    created_at=date.today()
                )
                db.session.add(payroll)
            else:
                # Update existing payroll
                payroll.base_salary = float(salary.base_salary)
                payroll.gross_salary = float(gross_salary)
                payroll.net_salary = float(net_salary)
                payroll.deductions = float(total_deductions)
                payroll.allowances = float(total_allowances)
                payroll.updated_at = date.today()
            
            # Không cần xử lý PayrollDetail nữa
            # Bỏ qua phần tạo và xóa chi tiết phiếu lương
            
            # Lưu thay đổi vào cơ sở dữ liệu
            db.session.commit()
            
            # Tạo mảng chi tiết thủ công cho phản hồi
            details = []
            
            # Thêm thông tin lương cơ bản
            if total_working_days >= standard_days:
                details.append({
                    "description": "Base Salary",
                    "amount": float(prorated_salary),
                    "type": "earning"
                })
            else:
                details.append({
                    "description": f"Prorated Salary ({total_working_days}/{standard_days} days)",
                    "amount": float(prorated_salary),
                    "type": "earning"
                })
            
            # Thêm thông tin làm thêm giờ
            if total_overtime > 0:
                details.append({
                    "description": f"Overtime Pay ({total_overtime} hours)",
                    "amount": float(overtime_pay),
                    "type": "earning"
                })
            
            # Thêm thông tin phụ cấp
            if allowance_records:
                for allowance in allowance_records:
                    details.append({
                        "description": f"Allowance: {allowance.description if hasattr(allowance, 'description') else 'General'}",
                        "amount": float(allowance.amount),
                        "type": "earning"
                    })
            
            # Thêm thông tin khấu trừ
            if deduction_records:
                for deduction in deduction_records:
                    details.append({
                        "description": f"Deduction: {deduction.description if hasattr(deduction, 'description') else 'General'}",
                        "amount": float(deduction.amount),
                        "type": "deduction"
                    })
            
            # Create response payload
            result = {
                "payroll_id": payroll.id,
                "employee_id": employee.id,
                "employee_name": employee.fullname,
                "period": f"{period_month}/{period_year}",
                "summary": {
                    "base_salary": float(salary.base_salary),
                    "prorated_salary": float(prorated_salary),
                    "working_days": total_working_days,
                    "standard_days": standard_days,
                    "overtime_hours": total_overtime,
                    "overtime_pay": float(overtime_pay),
                    "allowances": float(total_allowances),
                    "deductions": float(total_deductions),
                    "gross_salary": float(gross_salary),
                    "net_salary": float(net_salary)
                },
                "details": details  # Sử dụng mảng chi tiết đã tạo thủ công
            }
            
            return Success(
                message="Payroll processed successfully",
                status=200,
                payload=result
            ).to_json(), 200
            
        except SQLAlchemyError as e:
            db.session.rollback()
            return Error(
                message="Database error occurred during payroll processing",
                status=500,
                error=str(e)
            ).to_json(), 500
        except Exception as e:
            return Error(
                message="An error occurred while processing payroll",
                status=400,
                error=str(e)
            ).to_json(), 400
        
    @staticmethod
    def calculate_payroll_summary(employee_id, month, year, salary):
        """Calculate detailed payroll summary"""
        # Get attendance information for the month
        from app.models import Attendance
        attendance_records = Attendance.query.filter(
            Attendance.employee_id == employee_id,
            db.extract('month', Attendance.attendance_date) == month,
            db.extract('year', Attendance.attendance_date) == year
        ).all()
        
        # Calculate total working days
        total_working_days = len(attendance_records)
        
        # Calculate overtime
        total_overtime = sum(record.total_overtime or 0 for record in attendance_records)
        
        # Assume standard working days in a month is 22
        standard_days = 22
        
        # Calculate prorated salary if needed
        if total_working_days < standard_days:
            prorated_factor = decimal.Decimal(total_working_days) / decimal.Decimal(standard_days)
            prorated_salary = decimal.Decimal(str(salary.base_salary)) * prorated_factor
        else:
            prorated_salary = salary.base_salary
            
        # Assume overtime rate is 1.5 times hourly rate
        overtime_hourly_rate = (decimal.Decimal(str(salary.base_salary)) / decimal.Decimal('22') / decimal.Decimal('8')) * decimal.Decimal('1.5')
        overtime_pay = overtime_hourly_rate * decimal.Decimal(str(total_overtime))
        
        # Get allowances from your existing models
        from app.models import Allowance
        allowance_records = Allowance.query.filter_by(employee_id=employee_id).all()
        total_allowances = sum(decimal.Decimal(str(allowance.amount)) for allowance in allowance_records)
        
        # Get deductions from your existing models
        from app.models import Deduction
        deduction_records = Deduction.query.filter_by(employee_id=employee_id).all()
        total_deductions = sum(decimal.Decimal(str(deduction.amount)) for deduction in deduction_records)
        
        # Calculate gross and net salary
        gross_salary = prorated_salary + overtime_pay + total_allowances
        net_salary = gross_salary - total_deductions
        
        return {
            "gross_salary": float(gross_salary),
            "net_salary": float(net_salary),
            "base_salary": float(salary.base_salary),
            "prorated_salary": float(prorated_salary),
            "working_days": total_working_days,
            "standard_days": standard_days,
            "overtime_hours": total_overtime,
            "overtime_pay": float(overtime_pay),
            "allowances": float(total_allowances),
            "deductions": float(total_deductions)
        }
    
    @staticmethod
    def get_allowances_by_employee_month(employee_id, month, year): 
        try:
        # Tìm payroll của nhân viên trong tháng/năm
            payroll = Payroll.query.filter(
                Payroll.employee_id == employee_id,
                extract('month', Payroll.month) == int(month),
                Payroll.year == int(year)
            ).first()
            if not payroll:
                return {
                    "status": 404,
                    "message": "No payroll found for this employee in the given month/year",
                    "payload": []
                }
            # Lấy tất cả các bản ghi payrollAllowance theo payroll_id
            payroll_allowances = PayrollAllowance.query.filter_by(payroll_id=payroll.id).all()
            result = []
            for pa in payroll_allowances:
                allowance = Allowance.query.get(pa.allowance_id)
                result.append({
                    "id": allowance.id if allowance else None,
                    "name": allowance.name if allowance else "",
                    "money": float(allowance.money) if allowance else 0,
                    "attendance_date": pa.attendance_date.isoformat() if hasattr(pa, "attendance_date") and pa.attendance_date else ""
                })
            return {
                "status": 200,
                "payload": result
            }
        except Exception as e:
            return {
                "status": 500,
                "message": str(e),
                "payload": []
            }
    
    @staticmethod
    def get_deductions_by_employee_month(employee_id, month, year):
            try:
                # Tìm payroll của nhân viên trong tháng/năm
                payroll = Payroll.query.filter(
                    Payroll.employee_id == employee_id,
                    extract('month', Payroll.month) == int(month),
                    Payroll.year == int(year)
                ).first()
                if not payroll:
                    return {
                        "status": 404,
                        "message": "No payroll found for this employee in the given month/year",
                        "payload": []
                    }
                # Lấy tất cả các bản ghi payrollDeducation theo payroll_id
                payroll_deductions = PayrollDeducation.query.filter_by(payroll_id=payroll.id).all()
                result = []
                for pd in payroll_deductions:
                    deduction = Deducation.query.get(pd.deducation_id)
                    result.append({
                        "id": deduction.id if deduction else None,
                        "type_deducation": deduction.type_deducation if deduction else "",
                        "name_deducation": deduction.name_deducation if deduction else "",
                        "money": float(deduction.money) if deduction else 0,
                        "attendance_date": pd.attendance_date.isoformat() if pd.attendance_date else ""
                    })
                return {
                    "status": 200,
                    "payload": result
                }
            except Exception as e:
                return {
                    "status": 500,
                    "message": str(e),
                    "payload": []
                }