import unittest
import sys
import os
from unittest.mock import patch, MagicMock, Mock
from flask import Flask, json

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
        self.app.config['JWT_COOKIE_CSRF_PROTECT'] = False
        self.app.config['JWT_CSRF_IN_COOKIES'] = False

    @patch('app.services.auth_service.db')
    @patch('app.services.auth_service.set_access_cookies')
    @patch('app.services.auth_service.cipher')
    def test_login_success(self, mock_cipher, mock_set_cookies, mock_db):
        with self.app.app_context():
            # Mock input data
            json_data = {
                "username": "testuser",
                "password": "password123"
            }

            # Mock database query
            mock_user = MagicMock()
            mock_user.password = "encrypted_password"
            mock_user.id = 1
            mock_db.session.query.return_value.filter_by.return_value.first.return_value = mock_user

            # Mock cipher decryption
            mock_cipher.decrypt.return_value = b"password123"

            # Mock response
            mock_response = Mock()
            mock_response.get_data = Mock(return_value=json.dumps({"message": "Login successfully"}))
            mock_response.status_code = 200
            
            # Mock make_response and Success
            with patch('app.services.auth_service.make_response', return_value=mock_response):
                with patch('app.services.auth_service.Success') as mock_success:
                    with patch('app.services.auth_service.create_access_token', return_value="mock_token"):
                        # Call the service
                        response, status_code = AuthService.login(json_data)

                        # Assertions
                        self.assertEqual(status_code, 200)
                        self.assertEqual(response.status_code, 200)
                        mock_success.assert_called()

    @patch('app.services.auth_service.db')
    @patch('app.services.auth_service.cipher')
    def test_login_invalid_username(self, mock_cipher, mock_db):
        with self.app.app_context():
            # Mock input data
            json_data = {
                "username": "invaliduser",
                "password": "password123"
            }

            # Mock database query
            mock_db.session.query.return_value.filter_by.return_value.first.return_value = None

            # Mock error response
            mock_response = Mock()
            mock_response.get_data = Mock(return_value=json.dumps({"message": "Username not correct"}))
            mock_response.status_code = 400
            
            # Mock Error class
            with patch('app.services.auth_service.Error') as mock_error:
                mock_error.return_value.to_json.return_value = mock_response
                
                # Call the service
                response, status_code = AuthService.login(json_data)
                
                # Assertions
                self.assertEqual(status_code, 400)
                self.assertEqual(response.status_code, 400)
                mock_error.assert_called_with("Username not correct", 400)

    @patch('app.services.auth_service.db')
    @patch('app.services.auth_service.cipher')
    def test_login_invalid_password(self, mock_cipher, mock_db):
        with self.app.app_context():
            # Mock input data
            json_data = {
                "username": "testuser",
                "password": "wrongpassword"
            }

            # Mock database query
            mock_user = MagicMock()
            mock_user.password = "encrypted_password"
            mock_db.session.query.return_value.filter_by.return_value.first.return_value = mock_user

            # Mock cipher decryption
            mock_cipher.decrypt.return_value = b"password123"
            
            # Mock error response
            mock_response = Mock()
            mock_response.get_data = Mock(return_value=json.dumps({"message": "Password not correct"}))
            mock_response.status_code = 400
            
            # Mock Error class
            with patch('app.services.auth_service.Error') as mock_error:
                mock_error.return_value.to_json.return_value = mock_response
                
                # Call the service
                response, status_code = AuthService.login(json_data)
                
                # Assertions
                self.assertEqual(status_code, 400)
                self.assertEqual(response.status_code, 400)
                mock_error.assert_called_with("Password not correct", 400)

    @patch('app.services.auth_service.unset_jwt_cookies')
    def test_logout_success(self, mock_unset_cookies):
        with self.app.app_context():
            # Mock success response
            mock_response = Mock()
            mock_response.get_data = Mock(return_value=json.dumps({"message": "Logout successfully"}))
            mock_response.status_code = 200
            
            # Mock Success class
            with patch('app.services.auth_service.Success') as mock_success:
                mock_success.return_value.to_json.return_value = mock_response
                
                # Call the service
                response, status_code = AuthService.logout()
                
                # Assertions
                self.assertEqual(status_code, 200)
                self.assertEqual(response.status_code, 200)
                mock_success.assert_called_with(message="Logout successfully", status=200)

if __name__ == '__main__':
    unittest.main()
