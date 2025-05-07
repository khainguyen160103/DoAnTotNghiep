import unittest
import sys
import os
from unittest.mock import patch, MagicMock
import uuid
from flask import Flask

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.services.dayoff_services import DayoffServices
from app.models import DayOff
from app.utils import Error, Success

class TestDayoffServices(unittest.TestCase):

    def setUp(self):
        # Create a Flask app for testing
        self.app = Flask(__name__)
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        # Pop the application context
        self.app_context.pop()

    @patch('app.services.dayoff_services.db')
    @patch('app.services.dayoff_services.DayOffSchema')
    def test_get_dayoff_by_id_success(self, mock_schema, mock_db):
        # Setup
        mock_data = [MagicMock(), MagicMock()]  # Multiple dayoff records
        mock_db.session.query.return_value.filter_by.return_value.all.return_value = mock_data
        mock_schema.return_value.dump.return_value = [
            {"id": "dayoff1", "employee_id": "emp123", "DayOff_number": 10},
            {"id": "dayoff2", "employee_id": "emp123", "DayOff_number": 5}
        ]
        
        # Execute
        response, status = DayoffServices.get_dayoff_by_id("emp123")
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 200)
        self.assertIn("message", result)
        self.assertEqual(result["message"], "Day off found")
        self.assertIn("payload", result)  # Check for 'payload' instead of 'data'
        self.assertEqual(result["payload"], [  # Use 'payload' for the data
            {"id": "dayoff1", "employee_id": "emp123", "DayOff_number": 10},
            {"id": "dayoff2", "employee_id": "emp123", "DayOff_number": 5}
        ])
        mock_db.session.query.assert_called_with(DayOff)
        mock_db.session.query.return_value.filter_by.assert_called_with(employee_id="emp123")
        mock_schema.return_value.dump.assert_called_with(mock_data)

    @patch('app.services.dayoff_services.db')
    def test_get_dayoff_by_id_not_found(self, mock_db):
        # Setup
        mock_db.session.query.return_value.filter_by.return_value.all.return_value = []
        
        # Execute
        response, status = DayoffServices.get_dayoff_by_id("emp123")
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 404)
        self.assertEqual(result["message"], "Day off not found")

    @patch('app.services.dayoff_services.db')
    @patch('app.services.dayoff_services.DayOffSchema')
    def test_add_dayoff_success(self, mock_schema, mock_db):
        # Setup
        mock_schema.return_value.load.return_value = MagicMock()
        
        # Input data
        test_data = {
            "id": str(uuid.uuid4()),
            "employee_id": "emp123",
            "DayOff_number": 10,
            "DayOff_use": 2,
            "DayOff_year": 2023,
            "DayOff_month": 6
        }
        
        # Execute
        response, status = DayoffServices.add_dayoff(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 200)
        self.assertEqual(result["message"], "Create Successfully")
        mock_schema.return_value.load.assert_called_with(test_data)
        mock_db.session.add.assert_called_once()
        mock_db.session.commit.assert_called_once()

    @patch('app.services.dayoff_services.db')
    def test_add_dayoff_missing_employee_id(self, mock_db):
        # Input data with missing employee_id
        test_data = {
            "id": str(uuid.uuid4()),
            "DayOff_number": 10
        }
        
        # Execute
        response, status = DayoffServices.add_dayoff(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 400)
        self.assertEqual(result["message"], "Invalid input data - employee_id is required")
        mock_db.session.add.assert_not_called()

    @patch('app.services.dayoff_services.db')
    @patch('app.services.dayoff_services.DayOffSchema')
    def test_add_dayoff_exception(self, mock_schema, mock_db):
        # Setup
        mock_schema.return_value.load.side_effect = Exception("Schema loading error")
        
        # Input data
        test_data = {
            "employee_id": "emp123",
            "DayOff_number": 10
        }
        
        # Execute
        response, status = DayoffServices.add_dayoff(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 400)
        self.assertEqual(result["message"], "Schema loading error")
        mock_db.session.rollback.assert_called_once()

    @patch('app.services.dayoff_services.db')
    @patch('app.services.dayoff_services.DayOffSchema')
    def test_update_dayoff_success(self, mock_schema, mock_db):
        # Setup
        mock_record = MagicMock()
        mock_db.session.get.return_value = mock_record
        mock_schema.return_value.dump.return_value = {
            "id": "dayoff1",
            "employee_id": "emp123",
            "DayOff_number": 15,  # Updated value
            "DayOff_use": 5,
            "DayOff_year": 2023
        }
        
        # Input data
        test_data = {
            "id": "dayoff1",
            "DayOff_number": 15,  # Updating the number of days off
            "DayOff_use": 5
        }
        
        # Execute
        response, status = DayoffServices.update_dayoff(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 200)
        self.assertEqual(result["message"], "DayOff record updated successfully")
        self.assertEqual(mock_record.DayOff_number, 15)
        self.assertEqual(mock_record.DayOff_use, 5)
        mock_db.session.commit.assert_called_once()

    @patch('app.services.dayoff_services.db')
    def test_update_dayoff_missing_id(self, mock_db):
        # Input data without ID
        test_data = {
            "DayOff_number": 15
        }
        
        # Execute
        response, status = DayoffServices.update_dayoff(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 400)
        self.assertEqual(result["message"], "Dayoff ID is required")
        mock_db.session.get.assert_not_called()

    @patch('app.services.dayoff_services.db')
    def test_update_dayoff_not_found(self, mock_db):
        # Setup
        mock_db.session.get.return_value = None
        
        # Input data
        test_data = {
            "id": "dayoff1",
            "DayOff_number": 15
        }
        
        # Execute
        response, status = DayoffServices.update_dayoff(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 404)
        self.assertEqual(result["message"], "No dayoff record found with ID dayoff1")
        mock_db.session.commit.assert_not_called()

    @patch('app.services.dayoff_services.db')
    def test_update_dayoff_exception(self, mock_db):
        # Setup
        mock_db.session.get.return_value = MagicMock()
        mock_db.session.commit.side_effect = Exception("Database error")
        
        # Input data
        test_data = {
            "id": "dayoff1",
            "DayOff_number": 15
        }
        
        # Execute
        response, status = DayoffServices.update_dayoff(test_data)
        result = response.get_json()  # Extract JSON data
        
        # Assert
        self.assertEqual(status, 500)
        self.assertEqual(result["message"], "Database error")
        mock_db.session.rollback.assert_called_once()

if __name__ == "__main__":
    unittest.main()
