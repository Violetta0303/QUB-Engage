package com;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping()
public class EngagementScoreController {

    private static final double LEC_TOTAL = 33.0;
    private static final double LAB_TOTAL = 22.0;
    private static final double SUPP_TOTAL = 44.0;
    private static final double CAN_TOTAL = 55.0;

    @CrossOrigin(origins = "*")
    @GetMapping()
    public ResponseEntity<ApiResponse> calculateEngagementScore(
        @RequestParam(value = "attendance_1", required = false) Double lecHours,
        @RequestParam(value = "attendance_2", required = false) Double labHours,
        @RequestParam(value = "attendance_3", required = false) Double suppHours,
        @RequestParam(value = "attendance_4", required = false) Double canHours) {

        Map<String, Pair<Double, Pair<Double, Double>>> attendanceParams = new HashMap<>();
        attendanceParams.put("Lecture sessions", new Pair<>(lecHours, new Pair<>(0.0, LEC_TOTAL)));
        attendanceParams.put("Lab sessions", new Pair<>(labHours, new Pair<>(0.0, LAB_TOTAL)));
        attendanceParams.put("Support sessions", new Pair<>(suppHours, new Pair<>(0.0, SUPP_TOTAL)));
        attendanceParams.put("Canvas activities", new Pair<>(canHours, new Pair<>(0.0, CAN_TOTAL)));

        String errorMessage = validateAttendanceParameters(attendanceParams);

        if (!errorMessage.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(true, errorMessage.trim()));
        }

        double engagementScore = calculateEngagementScoreValue(lecHours, labHours, suppHours, canHours);
        ApiResponse response = new ApiResponse(false, engagementScore);
        return ResponseEntity.ok(response);
    }

    private String validateAttendanceParameters(Map<String, Pair<Double, Pair<Double, Double>>> attendanceParams) {
        StringBuilder errorMessageBuilder = new StringBuilder();

        for (Map.Entry<String, Pair<Double, Pair<Double, Double>>> entry : attendanceParams.entrySet()) {
            String sessionType = entry.getKey();
            Double hours = entry.getValue().getFirst();
            Double minRange = entry.getValue().getSecond().getFirst();
            Double maxRange = entry.getValue().getSecond().getSecond();

            if (hours == null) {
                errorMessageBuilder.append(String.format("Missing attendance or item for %s. ", sessionType));
            } else if (hours < minRange || hours > maxRange || hours.intValue() != hours) {
                errorMessageBuilder.append(String.format("Invalid attendance value for %s. Attendance should be an integer within the range [%.0f, %.0f]. ", sessionType, minRange, maxRange));
            }
        }

        return errorMessageBuilder.toString();
    }

    private double calculateEngagementScoreValue(double lecHours, double labHours, double suppHours, double canHours) {
        double wLec = 0.3;
        double wLab = 0.4;
        double wSupp = 0.15;
        double wCan = 0.15;

        return ((lecHours / LEC_TOTAL) * wLec +
                (labHours / LAB_TOTAL) * wLab +
                (suppHours / SUPP_TOTAL) * wSupp +
                (canHours / CAN_TOTAL) * wCan) * 100;
    }

    // Pair class for convenience
    class Pair<T, U> {
        private T first;
        private U second;

        public Pair(T first, U second) {
            this.first = first;
            this.second = second;
        }

        public T getFirst() { return first; }
        public U getSecond() { return second; }
    }
}

