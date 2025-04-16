import unittest
from app import app

class TestTotalAttendance(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_total_attendance(self):
        response = self.app.get('/?attendance_1=30&attendance_2=20&attendance_3=40&attendance_4=50')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['error'], False)
        self.assertEqual(data['total_attendance'], 140)

    def test_missing_attendance(self):
        response = self.app.get('/?attendance_1=30&attendance_3=40&attendance_4=50')
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], True)
        self.assertEqual(data['message'], "Missing attendance or item for attendance_2.")

    def test_non_integer_attendance(self):
        response = self.app.get('/?attendance_1=30&attendance_2=abc&attendance_3=40&attendance_4=50')
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], True)
        self.assertEqual(data['message'], "Invalid attendance value for attendance_2. Attendance should be an integer.")

    def test_invalid_attendance_range(self):
        response = self.app.get('/?attendance_1=30&attendance_2=100&attendance_3=40&attendance_4=50')
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], True)
        self.assertEqual(data['message'], "Invalid attendance value for attendance_2. Attendance should be an integer within the range [0, 22].")

if __name__ == '__main__':
    unittest.main()
