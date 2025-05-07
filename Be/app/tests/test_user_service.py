import unittest
import sys
import os
from unittest.mock import patch, MagicMock, Mock
from flask import Flask, jsonify

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.services import UserSerives

class TestUserServices(unittest.TestCase):

    def setUp(self):
        # Create a Flask app for testing
        self.app = Flask(__name__)

    @patch('app.services.user_service.db')
    @patch('app.services.user_service.UserSchemaFactory.employee_schema')
    @patch('app.services.user_service.UserSchemaFactory.account_schema')
    def test_create_user_success(self, mock_account_schema, mock_employee_schema, mock_db):
        with self.app.app_context():  # Set up application context
            # Mock input data
            json_data = {
                "id": 1,
                "username": "testuser",
                "password": "password123",
                "email": "test@example.com",
                "fullname": "Test User"
            }

            # Set up mock objects
            mock_employee = MagicMock()
            mock_account = MagicMock()
            mock_employee_schema.return_value.load.return_value = mock_employee
            mock_account_schema.return_value.load.return_value = mock_account

            # Mock database queries
            mock_db.session.get.return_value = None
            mock_db.session.query.return_value.filter_by.return_value.first.return_value = None
            mock_db.session.add = MagicMock()
            mock_db.session.commit = MagicMock()

            # Mock success response
            mock_response = {"message": "Create Successfully"}
            
            # Mock the Success class with patch to return only the dictionary
            with patch('app.services.user_service.Success') as mock_success:
                mock_success.return_value.to_json.return_value = mock_response
            
                # Call the service
                response = UserSerives.create_user(json_data)
                
                # Unpack the response tuple
                response_data, status_code = response
                
                # Assertions directly on the unpacked response
                self.assertEqual(response_data["message"], "Create Successfully")
                self.assertEqual(status_code, 200)

    @patch('app.services.user_service.db')
    def test_get_user_by_id_not_found(self, mock_db):
        with self.app.app_context():  # Set up application context
            # Mock database query to return None
            mock_db.session.query.return_value.filter_by.return_value.join.return_value.join.return_value.first.return_value = None

            # Mock error response
            mock_response = {"error": "Not Found User"}
            
            # Mock the Error class with patch to return only the dictionary
            with patch('app.services.user_service.Error') as mock_error:
                mock_error.return_value.to_json.return_value = mock_response
            
                # Call the service
                response = UserSerives.get_user_by_id(1)
                
                # Unpack the response tuple
                response_data, status_code = response
                
                # Assertions directly on the unpacked response object
                self.assertEqual(response_data["error"], "Not Found User")
                self.assertEqual(status_code, 404)

if __name__ == '__main__':
    unittest.main()