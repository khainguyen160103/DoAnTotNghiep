from sqlalchemy import extract, func, desc, and_
from datetime import datetime, timedelta
from calendar import monthrange

from app.extencions import db
from app.models import Attendance, Employee, Payroll, DayOff, letterLeave
from app.utils import Success, Error


class ReportService:
    @staticmethod
    def generate_attendance_report(month=None, year=None, employee_id=None):
        """
        Generate attendance report for all employees or a specific employee.
        Can be filtered by month and year.
        """
        try:
            # Start with basic query
            query = db.session.query(
                Employee.fullname,
                Employee.id,
                func.count(Attendance.id).label('total_days'),
                func.sum(Attendance.total_overtime).label('total_overtime'),
                func.count(case=(Attendance.attendance_status_id == 1, 1)).label('on_time_days'),
                func.count(case=(Attendance.attendance_status_id == 2, 1)).label('late_days'),
                func.count(case=(Attendance.attendance_status_id == 3, 1)).label('absent_days')
            ).outerjoin(Attendance, Employee.id == Attendance.employee_id)
            
            # Apply filters
            if month and year:
                query = query.filter(
                    extract('month', Attendance.attendance_date) == month,
                    extract('year', Attendance.attendance_date) == year
                )
            
            if employee_id:
                query = query.filter(Employee.id == employee_id)
                
            # Group by employee
            query = query.group_by(Employee.id, Employee.fullname)
            
            # Execute query
            results = query.all()
            
            # Format results
            report_data = []
            for row in results:
                report_data.append({
                    'employee_id': row.id,
                    'employee_name': row.fullname,
                    'total_days': row.total_days or 0,
                    'total_overtime': float(row.total_overtime or 0),
                    'on_time_days': row.on_time_days or 0,
                    'late_days': row.late_days or 0,
                    'absent_days': row.absent_days or 0
                })
                
            period = f"{month}/{year}" if month and year else "All time"
            
            return Success(
                message=f"Attendance report generated successfully for {period}",
                status=200,
                payload={
                    'period': period,
                    'generated_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    'data': report_data
                }
            ).to_json(), 200
            
        except Exception as e:
            return Error(
                message=f"Failed to generate attendance report: {str(e)}",
                status=500
            ).to_json(), 500
    
    @staticmethod
    def generate_salary_report(month=None, year=None, department=None):
        """
        Generate salary report by department or for all employees.
        Can be filtered by month and year.
        """
        try:
            # Start with basic query
            query = db.session.query(
                Employee.fullname,
                Employee.id,
                Employee.department,
                Payroll.base_salary,
                Payroll.gross_salary,
                Payroll.net_salary,
                Payroll.month,
                Payroll.year
            ).join(Payroll, Employee.id == Payroll.employee_id)
            
            # Apply filters
            if month and year:
                query = query.filter(
                    Payroll.month == month,
                    Payroll.year == year
                )
            
            if department:
                query = query.filter(Employee.department == department)
                
            # Execute query
            results = query.all()
            
            # Format results
            report_data = []
            total_base_salary = 0
            total_gross_salary = 0
            total_net_salary = 0
            
            for row in results:
                report_data.append({
                    'employee_id': row.id,
                    'employee_name': row.fullname,
                    'department': row.department,
                    'base_salary': float(row.base_salary or 0),
                    'gross_salary': float(row.gross_salary or 0),
                    'net_salary': float(row.net_salary or 0),
                    'period': f"{row.month}/{row.year}"
                })
                total_base_salary += float(row.base_salary or 0)
                total_gross_salary += float(row.gross_salary or 0)
                total_net_salary += float(row.net_salary or 0)
            
            period = f"{month}/{year}" if month and year else "All time"
            dept_filter = f"for {department}" if department else "for all departments"
            
            return Success(
                message=f"Salary report generated successfully {dept_filter} for {period}",
                status=200,
                payload={
                    'period': period,
                    'department': department or "All",
                    'generated_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    'summary': {
                        'total_base_salary': total_base_salary,
                        'total_gross_salary': total_gross_salary,
                        'total_net_salary': total_net_salary,
                        'employee_count': len(report_data)
                    },
                    'data': report_data
                }
            ).to_json(), 200
            
        except Exception as e:
            return Error(
                message=f"Failed to generate salary report: {str(e)}",
                status=500
            ).to_json(), 500
    
    @staticmethod
    def generate_late_report(month=None, year=None, threshold_minutes=15):
        """
        Generate report of employees who arrived late.
        Can be filtered by month and year.
        """
        try:
            # Start with basic query
            query = db.session.query(
                Employee.fullname,
                Employee.id,
                Employee.department,
                func.count(Attendance.id).label('late_count'),
                func.min(Attendance.time_in).label('earliest_late'),
                func.max(Attendance.time_in).label('latest_late'),
                func.array_agg(Attendance.attendance_date).label('late_dates')
            ).join(
                Attendance, 
                and_(
                    Employee.id == Attendance.employee_id,
                    Attendance.attendance_status_id == 2  # Status code for late attendance
                )
            )
            
            # Apply filters
            if month and year:
                days_in_month = monthrange(year, month)[1]
                start_date = datetime(year, month, 1)
                end_date = datetime(year, month, days_in_month)
                
                query = query.filter(
                    Attendance.attendance_date >= start_date,
                    Attendance.attendance_date <= end_date
                )
            
            # Group by employee
            query = query.group_by(Employee.id, Employee.fullname, Employee.department)
            
            # Order by late count (most late first)
            query = query.order_by(desc('late_count'))
            
            # Execute query
            results = query.all()
            
            # Format results
            report_data = []
            for row in results:
                report_data.append({
                    'employee_id': row.id,
                    'employee_name': row.fullname,
                    'department': row.department,
                    'late_count': row.late_count,
                    'earliest_late': row.earliest_late.strftime("%H:%M:%S") if row.earliest_late else None,
                    'latest_late': row.latest_late.strftime("%H:%M:%S") if row.latest_late else None,
                    'late_dates': [date.strftime("%Y-%m-%d") for date in row.late_dates] if row.late_dates else []
                })
            
            period = f"{month}/{year}" if month and year else "All time"
            
            return Success(
                message=f"Late arrival report generated successfully for {period}",
                status=200,
                payload={
                    'period': period,
                    'generated_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    'threshold_minutes': threshold_minutes,
                    'summary': {
                        'total_employees_late': len(report_data),
                        'total_late_instances': sum(item['late_count'] for item in report_data)
                    },
                    'data': report_data
                }
            ).to_json(), 200
            
        except Exception as e:
            return Error(
                message=f"Failed to generate late arrival report: {str(e)}",
                status=500
            ).to_json(), 500
