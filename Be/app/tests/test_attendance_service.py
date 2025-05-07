import unittest
import sys
import os
from unittest.mock import patch, MagicMock
from flask import Flask
import json

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.services.attendance_service import AttendanceService
from app.utils import Success, Error

class TestAttendanceService(unittest.TestCase):

    def setUp(self):
        # Create a Flask app for testing
        self.app = Flask(__name__)

    @patch('app.services.attendance_service.Attendance')
    @patch('app.services.attendance_service.db')
    def test_add_attendance_success(self, mock_db, mock_attendance):
        with self.app.app_context():
            mock_data = {
                "attendance_date": "2023-10-01",
                "time_in": "09:00:00",
                "time_out": "17:00:00",
                "note": "Worked full day",
                "total_overtime": None,
                "employee_id": "123",
                "attendance_status_id": 1
            }
            mock_attendance.return_value = MagicMock()
            response, status_code = AttendanceService.add_attendance(mock_data)
            self.assertEqual(status_code, 200)
            response_data = json.loads(response.get_data(as_text=True))
            self.assertEqual(response_data["message"], "Thêm chấm công thành công")
            mock_db.session.add.assert_called()
            mock_db.session.commit.assert_called()

    @patch('app.services.attendance_service.Attendance')
    def test_get_attendance_by_employee_id_success(self, mock_attendance):
        with self.app.app_context():
            mock_attendance.query.filter_by.return_value.all.return_value = [
                MagicMock(to_dict=lambda: {"id": "1", "employee_id": "123"})
            ]
            response, status_code = AttendanceService.get_attendance_by_employee_id("123")
            self.assertEqual(status_code, 200)
            response_data = json.loads(response.get_data(as_text=True))
            self.assertEqual(response_data["message"], "Lấy danh sách chấm công thành công")

    @patch('app.services.attendance_service.Attendance')
    def test_get_attendance_by_month_year_success(self, mock_attendance):
        with self.app.app_context():
            mock_attendance.query.filter.return_value.all.return_value = [
                MagicMock(to_dict=lambda: {"id": "1", "attendance_date": "2023-10-01"})
            ]
            response, status_code = AttendanceService.get_attendance_by_month_year(10, 2023)
            self.assertEqual(status_code, 200)
            response_data = json.loads(response.get_data(as_text=True))
            self.assertEqual(response_data["message"], "Lấy danh sách chấm công thành công")

    @patch('app.services.attendance_service.Attendance')
    @patch('app.services.attendance_service.db')
    def test_delete_attendance_success(self, mock_db, mock_attendance):
        with self.app.app_context():
            mock_attendance.query.get.return_value = MagicMock()
            response, status_code = AttendanceService.delete_attendance("1")
            self.assertEqual(status_code, 200)
            response_data = json.loads(response.get_data(as_text=True))
            self.assertEqual(response_data["message"], "Xóa chấm công thành công")
            mock_db.session.delete.assert_called()
            mock_db.session.commit.assert_called()

    @patch('app.services.attendance_service.Attendance')
    @patch('app.services.attendance_service.db')
    def test_update_attendance_success(self, mock_db, mock_attendance):
        with self.app.app_context():
            mock_attendance.query.get.return_value = MagicMock()
            mock_data = {
                "id": "1",
                "attendance_date": "2023-10-01",
                "time_in": "09:00:00",
                "time_out": "17:00:00",
                "note": "Updated note",
                "total_overtime": None,
                "employee_id": "123",
                "attendance_status_id": 1
            }
            response, status_code = AttendanceService.update_attendance(mock_data)
            self.assertEqual(status_code, 200)
            response_data = json.loads(response.get_data(as_text=True))
            self.assertEqual(response_data["message"], "Cập nhật chấm công thành công")
            mock_db.session.commit.assert_called()

if __name__ == '__main__':
    unittest.main()
