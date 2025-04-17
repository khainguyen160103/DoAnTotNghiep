import unittest
import sys
import os
from unittest.mock import patch, MagicMock
from flask import Flask

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.services import AuthService

class TestAuthService(unittest.TestCase):

    def setUp(self):
        # Create a Flask app for testing
        self.app = Flask(__name__)
        self.app.config['JWT_SECRET_KEY'] = 'test_secret_key'
        self.app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
        self.app.config['JWT_COOKIE_SECURE'] = False
        self.app.config['JWT_COOKIE_DOMAIN'] = 'localhost'
        self.app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
        self.app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
        self.app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Add this line
        self.app.config['JWT_CSRF_IN_COOKIES'] = False      # Add this line

    @patch('app.services.auth_service.db')
    @patch('app.services.auth_service.set_access_cookies')  # Mock set_access_cookies
    def test_login_success(self, mock_set_cookies, mock_db):
        with self.app.app_context():  # Set up application context
            # Mock input data
            json_data = {
                "username": "testuser",
                "password": "password123"
            }

            # Mock database query
            mock_user = MagicMock()
            mock_user.password = "hashed_password"
            mock_user.id = 1
            mock_db.session.query.return_value.filter_by.return_value.first.return_value = mock_user

            # Mock password verification and token creation
            with patch('app.services.auth_service.check_password_hash', return_value=True):
                with patch('app.services.auth_service.create_access_token', return_value="mock_token"):
                    response, status_code = AuthService.login(json_data)

            # Assertions directly on the response object
            self.assertEqual(status_code, 200)
            # Use get_data and decode for response body instead of get_json
            self.assertIn("Login successfully", response.get_data(as_text=True))
            self.assertIn("mock_token", response.get_data(as_text=True))

    @patch('app.services.auth_service.db')
    def test_login_invalid_username(self, mock_db):
        with self.app.app_context():  # Set up application context
            # Mock input data
            json_data = {
                "username": "invaliduser",
                "password": "password123"
            }

            # Mock database query
            mock_db.session.query.return_value.filter_by.return_value.first.return_value = None

            # Call the service
            response, status_code = AuthService.login(json_data)

            # Assertions directly on the response object
            self.assertEqual(status_code, 400)
            self.assertIn("Username not correct", response.get_data(as_text=True))

    @patch('app.services.auth_service.db')
    def test_login_invalid_password(self, mock_db):
        with self.app.app_context():  # Set up application context
            # Mock input data
            json_data = {
                "username": "testuser",
                "password": "wrongpassword"
            }

            # Mock database query
            mock_user = MagicMock()
            mock_user.password = "hashed_password"
            mock_db.session.query.return_value.filter_by.return_value.first.return_value = mock_user

            # Mock password verification
            with patch('app.services.auth_service.check_password_hash', return_value=False):
                response, status_code = AuthService.login(json_data)

            # Assertions directly on the response object
            self.assertEqual(status_code, 400)
            self.assertIn("Password not correct", response.get_data(as_text=True))

    @patch('app.services.auth_service.unset_jwt_cookies')  # Mock unset_jwt_cookies
    def test_logout_success(self, mock_unset_cookies):
        with self.app.app_context():  # Set up application context
            # Call the service
            response, status_code = AuthService.logout()

            # Assertions directly on the response object
            self.assertEqual(status_code, 200)
            self.assertIn("Logout successfully", response.get_data(as_text=True))

if __name__ == '__main__':
    unittest.main()
