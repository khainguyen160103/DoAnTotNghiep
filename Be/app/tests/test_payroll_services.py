import unittest
import sys
import os
from unittest.mock import patch, MagicMock
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.services.payroll_services import PayrollService  # Ensure this import is correct
from app.models import Payroll, Employee, Attendance, Deducation, Allowance  # Ensure these models exist
from app.schemas import PayrollSchema
from app.utils import Error, Success

# Initialize SQLAlchemy
db = SQLAlchemy()

class TestPayrollService(unittest.TestCase):

    def setUp(self):
        # Create a Flask app for testing
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        # Initialize the database with the app
        db.init_app(self.app)

        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        # Pop the application context
        self.app_context.pop()

    @patch('app.services.payroll_services.Employee')
    @patch('app.services.payroll_services.db')
    def test_create_salary_employee_not_found(self, mock_db, mock_employee):
        # Setup mocks
        mock_employee.query.get.return_value = None
        
        # Call method
        data = {'employee_id': '123'}
        response, status = PayrollService.create_salary(data)
        result = response.get_json()  # Extract JSON data
        
        # Assertions
        self.assertEqual(status, 404)
        self.assertIn('Employee not found', result['message'])

    @patch('app.services.payroll_services.PayrollSchema')
    @patch('app.services.payroll_services.db')
    def test_create_salary_database_error(self, mock_db, mock_schema):
        # Setup mocks
        mock_employee = MagicMock()
        with patch('app.services.payroll_services.Employee') as mock_employee_class:
            mock_employee_class.query.get.return_value = mock_employee
            mock_db.session.commit.side_effect = Exception('DB Error')
            
            # Call method
            data = {'employee_id': '123'}
            response, status = PayrollService.create_salary(data)
            result = response.get_json()  # Extract JSON data
            
            # Assertions
            self.assertEqual(status, 500)
            self.assertIn('Database error occurred', result['message'])

    @patch('app.services.payroll_services.Payroll')
    @patch('app.services.payroll_services.PayrollSchema')
    @patch('app.services.payroll_services.db')
    def test_update_salary_success(self, mock_db, mock_schema, mock_payroll):
        # Setup mocks
        mock_salary = MagicMock()
        mock_payroll.query.get.return_value = mock_salary
        mock_schema.return_value = MagicMock()
        mock_schema.return_value.dump.return_value = {'id': 'test-id'}
        
        # Call method
        data = {'id': '123', 'base_salary': 1500}
        result, status = PayrollService.update_salary(data)
        
        # Assertions
        self.assertEqual(status, 200)
        self.assertEqual(mock_salary.base_salary, 1500)
        mock_db.session.commit.assert_called_once()
    
    @patch('app.services.payroll_services.Payroll')
    def test_update_salary_not_found(self, mock_payroll):
        # Setup mocks
        mock_payroll.query.get.return_value = None
        
        # Call method
        data = {'id': '123'}
        result, status = PayrollService.update_salary(data)
        
        # Assertions
        self.assertEqual(status, 404)
        self.assertIn('Salary record not found', result['message'])  # Updated assertion
    
    @patch('app.services.payroll_services.Payroll')
    @patch('app.services.payroll_services.PayrollSchema')
    def test_get_salary_by_id_success(self, mock_schema, mock_payroll):
        # Setup mocks
        mock_payroll.query.get.return_value = MagicMock()
        mock_schema.return_value = MagicMock()
        mock_schema.return_value.dump.return_value = {'id': 'test-id'}
        
        # Call method
        response, status = PayrollService.get_salary_by_id('123')
        result = response.get_json()  # Extract JSON data
        
        # Assertions
        self.assertEqual(status, 200)
        self.assertIn('id', result['payload'])  # Updated to check 'payload'

    @patch('app.services.payroll_services.Payroll')
    def test_get_salary_by_id_not_found(self, mock_payroll):
        # Setup mocks
        mock_payroll.query.get.return_value = None
        
        # Call method
        response, status = PayrollService.get_salary_by_id('123')
        result = response.get_json()  # Extract JSON data
        
        # Assertions
        self.assertEqual(status, 404)
        self.assertIn('Salary record not found', result['message'])  # Updated assertion
    
    @patch('app.services.payroll_services.Employee')
    @patch('app.services.payroll_services.Payroll')
    @patch('app.services.payroll_services.PayrollSchema')
    def test_get_salary_by_employee_id_success(self, mock_schema, mock_payroll, mock_employee):
        # Setup mocks
        mock_employee.query.get.return_value = MagicMock()
        mock_payroll.query.filter_by.return_value.all.return_value = [MagicMock(), MagicMock()]
        mock_schema.return_value = MagicMock()
        mock_schema.return_value.dump.return_value = [{'id': 'test-id1'}, {'id': 'test-id2'}]
        
        # Call method
        response, status = PayrollService.get_salary_by_employee_id('123')
        result = response.get_json()  # Extract JSON data
        
        # Assertions
        self.assertEqual(status, 200)
        self.assertIn('id', str(result))

    @patch('app.services.payroll_services.Employee')
    def test_get_salary_by_employee_id_employee_not_found(self, mock_employee):
        # Setup mocks
        mock_employee.query.get.return_value = None
        
        # Call method
        response, status = PayrollService.get_salary_by_employee_id('123')
        result = response.get_json()  # Extract JSON data
        
        # Assertions
        self.assertEqual(status, 404)
        self.assertIn('Employee not found', result['message'])  # Updated assertion
    
    @patch('app.services.payroll_services.Payroll')
    @patch('app.services.payroll_services.PayrollSchema')
    def test_get_all_salaries_success(self, mock_schema, mock_payroll):
        # Setup mocks
        mock_payroll.query.all.return_value = [MagicMock(), MagicMock()]
        mock_schema.return_value = MagicMock()
        mock_schema.return_value.dump.return_value = [{'id': 'test-id1'}, {'id': 'test-id2'}]
        
        # Call method
        response, status = PayrollService.get_all_salaries()
        result = response.get_json()  # Extract JSON data
        
        # Assertions
        self.assertEqual(status, 200)
        self.assertIn('id', str(result))
    
    @patch('app.services.payroll_services.Employee')
    @patch('app.services.payroll_services.Payroll')
    @patch('app.services.payroll_services.Attendance')
    @patch('app.services.payroll_services.db')
    def test_generate_salary_slip_success(self, mock_db, mock_attendance, mock_payroll, mock_employee):
        # Setup mocks
        mock_employee_obj = MagicMock()
        mock_employee_obj.fullname = "John Doe"
        mock_employee_obj.position = MagicMock()
        mock_employee_obj.position.name = "Developer"
        mock_employee.query.get.return_value = mock_employee_obj
        
        mock_salary = MagicMock()
        mock_salary.base_salary = 5000
        mock_payroll.query.filter_by.return_value.first.return_value = mock_salary
        
        mock_attendance_records = [MagicMock(), MagicMock()]
        for record in mock_attendance_records:
            record.total_overtime = 2
        mock_attendance.query.filter.return_value.all.return_value = mock_attendance_records
        
        # Call method
        result, status = PayrollService.generate_salary_slip('123', 6, 2023)
        
        # Assertions
        self.assertEqual(status, 200)
        self.assertIn('employee_id', str(result))
        self.assertIn('net_salary', str(result))
    
    @patch('app.services.payroll_services.Employee')
    def test_generate_salary_slip_employee_not_found(self, mock_employee):
        # Setup mocks
        mock_employee.query.get.return_value = None
        
        # Call method
        response, status = PayrollService.generate_salary_slip('123', 6, 2023)
        result = response.get_json()  # Extract JSON data
        
        # Assertions
        self.assertEqual(status, 404)
        self.assertIn('Employee not found', result['message'])  # Updated assertion
    
    @patch('app.services.payroll_services.Employee')
    @patch('app.services.payroll_services.Payroll')
    @patch('app.services.payroll_services.Attendance')
    @patch('app.services.payroll_services.Allowance')
    @patch('app.services.payroll_services.Deducation')  # Corrected to use Deducation
    @patch('app.services.payroll_services.db')
    def test_process_payroll_success(self, mock_db, mock_deduction, mock_allowance, 
                                      mock_attendance, mock_payroll, mock_employee):
        # Setup mocks
        mock_employee_obj = MagicMock()
        mock_employee_obj.id = '123'
        mock_employee_obj.fullname = "John Doe"
        mock_employee.query.get.return_value = mock_employee_obj
        
        mock_salary = MagicMock()
        mock_salary.base_salary = 5000
        mock_payroll.query.filter_by.return_value.first.return_value = mock_salary
        
        mock_attendance_records = [MagicMock(), MagicMock()]
        for record in mock_attendance_records:
            record.total_overtime = 2
        mock_attendance.query.filter.return_value.all.return_value = mock_attendance_records
        
        mock_allowance_records = [MagicMock(), MagicMock()]
        for record in mock_allowance_records:
            record.amount = 100
            record.description = "Transport"
        mock_allowance.query.filter_by.return_value.all.return_value = mock_allowance_records
        
        mock_deduction_records = [MagicMock()]
        for record in mock_deduction_records:
            record.amount = 50
            record.description = "Tax"
        mock_deduction.query.filter_by.return_value.all.return_value = mock_deduction_records
        
        # Call method
        data = {'employee_id': '123', 'month': 6, 'year': 2023}
        response, status = PayrollService.process_payroll(data)
        result = response.get_json()  # Extract JSON data
        
        # Assertions
        self.assertEqual(status, 200)
        self.assertIn('payroll_id', result['payload'])  # Updated to check 'payload'
    
    @patch('app.services.payroll_services.Employee')
    def test_process_payroll_employee_not_found(self, mock_employee):
        # Setup mocks
        mock_employee.query.get.return_value = None
        
        # Call method
        data = {'employee_id': '123', 'month': 6, 'year': 2023}
        result, status = PayrollService.process_payroll(data)
        
        # Assertions
        self.assertEqual(status, 404)
        self.assertIn('Employee not found', result['message'])  # Updated assertion
    
    @patch('app.services.payroll_services.Employee')
    def test_process_payroll_missing_period(self, mock_employee):
        # Setup mocks
        mock_employee.query.get.return_value = MagicMock()
        
        # Call method with missing month/year
        data = {'employee_id': '123'}
        result, status = PayrollService.process_payroll(data)
        
        # Assertions
        self.assertEqual(status, 400)
        self.assertIn('Month and year are required', result['message'])  # Updated assertion

    @patch('app.services.payroll_services.Attendance')
    @patch('app.services.payroll_services.Allowance')
    @patch('app.services.payroll_services.Deducation')  # Corrected to use Deducation
    def test_calculate_payroll_summary(self, mock_deduction, mock_allowance, mock_attendance):
        # Setup mocks
        mock_attendance_records = [MagicMock(), MagicMock()]
        for record in mock_attendance_records:
            record.total_overtime = 2
        mock_attendance.query.filter.return_value.all.return_value = mock_attendance_records
        
        mock_allowance_records = [MagicMock()]
        for record in mock_allowance_records:
            record.amount = 100
        mock_allowance.query.filter_by.return_value.all.return_value = mock_allowance_records
        
        mock_deduction_records = [MagicMock()]
        for record in mock_deduction_records:
            record.amount = 50
        mock_deduction.query.filter_by.return_value.all.return_value = mock_deduction_records
        
        # Create a mock salary object
        mock_salary = MagicMock()
        mock_salary.base_salary = 5000
        
        # Call method
        result = PayrollService.calculate_payroll_summary('123', 6, 2023, mock_salary)
        
        # Assertions
        self.assertIn('gross_salary', result)
        self.assertIn('net_salary', result)
        self.assertIn('base_salary', result)
        self.assertEqual(result['base_salary'], 5000)
        self.assertEqual(result['working_days'], 2)

if __name__ == '__main__':
    unittest.main()
