import unittest
import sys
import os
from unittest.mock import patch, MagicMock, Mock
import uuid
from flask import Flask

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.services.formSubmission_service import FormSubmissionService
from app.models import letterLeave, letterOvertime, letterVertification
import json

class TestFormSubmissionService(unittest.TestCase):

    def setUp(self):
        # Create a Flask app for testing
        self.app = Flask(__name__)
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        # Pop the application context
        self.app_context.pop()

    @patch('app.services.formSubmission_service.db')
    @patch('app.services.formSubmission_service.LetterVertificationSchema')
    def test_create_form_ver_success(self, mock_schema, mock_db):
        # Setup
        mock_db.session.get.return_value = None
        mock_schema.return_value = MagicMock()
        mock_schema.return_value.load.return_value = MagicMock()
        
        # Mock success response
        mock_response = Mock()
        mock_response.get_data = Mock(return_value=json.dumps({"message": "Create Successfully"}))
        
        # Input data
        test_data = {
            "id": str(uuid.uuid4()),
            "department": "HR",
            "subject": "Test subject",
            "content": "Test content",
            "status": "pending"
        }
        
        # Mock Success class
        with patch('app.services.formSubmission_service.Success') as mock_success:
            mock_success.return_value.to_json.return_value = mock_response
            
            # Execute
            result, status = FormSubmissionService.create_form_ver(test_data)
        
            # Assert
            self.assertEqual(status, 200)
            mock_db.session.add.assert_called_once()
            mock_db.session.commit.assert_called_once()
            mock_success.assert_called_with(message="Create Successfully", status=200)

    @patch('app.services.formSubmission_service.db')
    def test_create_form_ver_duplicate_id(self, mock_db):
        # Setup
        mock_db.session.get.return_value = MagicMock()  # Simulating existing record
        
        # Mock error response
        mock_response = Mock()
        mock_response.get_data = Mock(return_value=json.dumps({"message": "ID already exists"}))
        
        # Input data
        test_data = {
            "id": str(uuid.uuid4()),
            "department": "HR",
            "subject": "Test subject"
        }
        
        # Mock Error class
        with patch('app.services.formSubmission_service.Error') as mock_error:
            mock_error.return_value.to_json.return_value = mock_response
            
            # Execute
            result, status = FormSubmissionService.create_form_ver(test_data)
            
            # Assert
            self.assertEqual(status, 400)
            mock_db.session.add.assert_not_called()
            mock_error.assert_called_with(message="ID already exists", status=400)

    @patch('app.services.formSubmission_service.db')
    @patch('app.services.formSubmission_service.LetterLeaveSchema')
    def test_create_form_leave_success(self, mock_schema, mock_db):
        # Setup
        mock_db.session.get.return_value = None
        mock_schema.return_value = MagicMock()
        mock_schema.return_value.load.return_value = MagicMock()
        
        # Mock success response
        mock_response = Mock()
        mock_response.get_data = Mock(return_value=json.dumps({"message": "Create Successfully"}))
        
        # Input data
        test_data = {
            "id": str(uuid.uuid4()),
            "employee_id": "emp123",
            "from_date": "2023-06-01",
            "to_date": "2023-06-05",
            "reason": "Personal leave",
            "status": "pending"
        }
        
        # Mock Success class
        with patch('app.services.formSubmission_service.Success') as mock_success:
            mock_success.return_value.to_json.return_value = mock_response
            
            # Execute
            result, status = FormSubmissionService.create_form_leave(test_data)
            
            # Assert
            self.assertEqual(status, 200)
            mock_db.session.add.assert_called_once()
            mock_db.session.commit.assert_called_once()

    @patch('app.services.formSubmission_service.db')
    def test_create_form_leave_duplicate_id(self, mock_db):
        # Setup
        mock_db.session.get.return_value = MagicMock()  # Simulating existing record
        
        # Input data
        test_data = {
            "id": str(uuid.uuid4()),
            "employee_id": "emp123",
            "from_date": "2023-06-01"
        }
        
        # Execute
        response, status = FormSubmissionService.create_form_leave(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 400)
        self.assertIn("ID already exists", result["message"])

    @patch('app.services.formSubmission_service.db')
    @patch('app.services.formSubmission_service.LetterOvertimeSchema')
    def test_create_form_over_success(self, mock_schema, mock_db):
        # Setup
        mock_db.session.get.return_value = None
        mock_schema.return_value = MagicMock()
        mock_schema.return_value.load.return_value = MagicMock()
        
        # Input data
        test_data = {
            "id": str(uuid.uuid4()),
            "employee_id": "emp123",
            "date": "2023-06-01",
            "hours": 2,
            "reason": "Urgent project",
            "status": "pending"
        }
        
        # Execute
        result, status = FormSubmissionService.create_form_over(test_data)
        
        # Assert
        self.assertEqual(status, 200)
        mock_db.session.add.assert_called_once()
        mock_db.session.commit.assert_called_once()

    @patch('app.services.formSubmission_service.db')
    def test_create_form_over_duplicate_id(self, mock_db):
        # Setup
        mock_db.session.get.return_value = MagicMock()  # Simulating existing record
        
        # Input data
        test_data = {
            "id": str(uuid.uuid4()),
            "employee_id": "emp123",
            "date": "2023-06-01"
        }
        
        # Execute
        response, status = FormSubmissionService.create_form_over(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 400)
        self.assertIn("ID already exists", result["message"])

    @patch('app.services.formSubmission_service.db')
    def test_delete_form_vertification_success(self, mock_db):
        # Setup
        letter_ver_mock = MagicMock()
        mock_db.session.get.side_effect = [letter_ver_mock, None, None]
        
        # Execute
        response, status = FormSubmissionService.delete_form("test-id")
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 200)
        self.assertIn("Form deleted successfully", result["message"])
        mock_db.session.delete.assert_called_with(letter_ver_mock)
        mock_db.session.commit.assert_called_once()

    @patch('app.services.formSubmission_service.db')
    def test_delete_form_leave_success(self, mock_db):
        # Setup
        letter_leave_mock = MagicMock()
        mock_db.session.get.side_effect = [None, letter_leave_mock, None]
        
        # Execute
        response, status = FormSubmissionService.delete_form("test-id")
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 200)
        self.assertIn("Form deleted successfully", result["message"])
        mock_db.session.delete.assert_called_with(letter_leave_mock)
        mock_db.session.commit.assert_called_once()

    @patch('app.services.formSubmission_service.db')
    def test_delete_form_overtime_success(self, mock_db):
        # Setup
        letter_ot_mock = MagicMock()
        mock_db.session.get.side_effect = [None, None, letter_ot_mock]
        
        # Execute
        response, status = FormSubmissionService.delete_form("test-id")
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 200)
        self.assertIn("Form deleted successfully", result["message"])
        mock_db.session.delete.assert_called_with(letter_ot_mock)
        mock_db.session.commit.assert_called_once()

    @patch('app.services.formSubmission_service.db')
    def test_delete_form_not_found(self, mock_db):
        # Setup
        mock_db.session.get.return_value = None
        
        # Execute
        response, status = FormSubmissionService.delete_form("test-id")
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 404)
        self.assertIn("ID not found", result["message"])
        mock_db.session.delete.assert_not_called()

    @patch('app.services.formSubmission_service.db')
    def test_delete_form_database_error(self, mock_db):
        # Setup
        letter_ver_mock = MagicMock()
        mock_db.session.get.return_value = letter_ver_mock
        mock_db.session.commit.side_effect = Exception("Database error")
        
        # Mock error response
        mock_response = {"message": "An error occurred while deleting the form"}  # Updated message
        
        # Mock Error class
        with patch('app.services.formSubmission_service.Error') as mock_error:
            mock_error.return_value.to_json.return_value = mock_response
            
            # Execute
            response, status = FormSubmissionService.delete_form("test-id")
            result = response  # Use the mock response directly
            
            # Assert
            self.assertEqual(status, 500)
            self.assertEqual(result["message"], "An error occurred while deleting the form")
            mock_db.session.rollback.assert_called_once()

    @patch('app.services.formSubmission_service.letterVertification')
    @patch('app.services.formSubmission_service.letterLeave')
    @patch('app.services.formSubmission_service.letterOvertime')
    @patch('app.services.formSubmission_service.db')
    def test_get_all_success(self, mock_db, mock_ot, mock_leave, mock_ver):
        # Setup
        mock_ver_record = MagicMock()
        mock_ver_record.__table__ = MagicMock()
        mock_ver_record.__table__.columns = [MagicMock()]
        
        # Mock the data returned by the query
        mock_ver_record.__table__.columns[0].name = "id"
        mock_ver_record.id = "test-id"
        mock_db.session.get.return_value = mock_ver_record
        
        # Execute
        response, status = FormSubmissionService.get_all_by_id("test-id")
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 200)
        self.assertIn("Form retrieved successfully", result["message"])

    @patch('app.services.formSubmission_service.db')
    def test_get_all_by_id_not_found(self, mock_db):
        # Setup
        mock_db.session.get.return_value = None
        
        # Execute
        response, status = FormSubmissionService.get_all_by_id("test-id")
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 404)
        self.assertIn("ID not found", result["message"])

if __name__ == "__main__":
    unittest.main()
