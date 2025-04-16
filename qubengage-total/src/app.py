from flask import Flask, request, Response
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def get_total_attendance():
    attendance_ranges = {
        "attendance_1": {"min": 0, "max": 33},
        "attendance_2": {"min": 0, "max": 22},
        "attendance_3": {"min": 0, "max": 44},
        "attendance_4": {"min": 0, "max": 55}
    }

    attendance_values = []
    for i in range(1, 5):
        attendance_key = f'attendance_{i}'
        attendance = request.args.get(attendance_key)
        if attendance is None:
            r = json.dumps({"error": True, "message": f"Missing attendance or item for {attendance_key}."})
            return Response(response=r, status=400, mimetype='application/json')
        
        if not attendance.isdigit():
            r = json.dumps({"error": True, "message": f"Invalid attendance value for {attendance_key}. Attendance should be an integer."})
            return Response(response=r, status=400, mimetype='application/json')

        attendance = int(attendance)
        if attendance < attendance_ranges[attendance_key]["min"] or attendance > attendance_ranges[attendance_key]["max"]:
            r = json.dumps({"error": True, "message": f"Invalid attendance value for {attendance_key}. Attendance should be an integer within the range [{attendance_ranges[attendance_key]['min']}, {attendance_ranges[attendance_key]['max']}]."})
            return Response(response=r, status=400, mimetype='application/json')

        attendance_values.append(attendance)
    
    total_attendance = sum(attendance_values)
    r = json.dumps({"error": False, "total_attendance": total_attendance})
    return Response(response=r, status=200, mimetype='application/json')

@app.errorhandler(404)
def not_found(error):
    r = json.dumps({"error": "Resource not found"})
    return Response(response=r, status=404, mimetype='application/json')

@app.errorhandler(500)
def internal_error(error):
    r = json.dumps({"error": "Internal server error"})
    return Response(response=r, status=500, mimetype='application/json')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


