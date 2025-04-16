<?php
// This function sorts the attendance and items and returns the result
function getSortedAttendance($items, $attendances)
{
    // Combine items and attendance into a single array for sorting
    $item_attendances = [];
    foreach ($items as $index => $item) {
        if (trim($item) === '') {
            return ['error' => 'Input error: Item name cannot be empty.'];
        }
        $item_attendances[] = ["item" => $item, "attendance" => $attendances[$index]];
    }

    // Sort the array based on attendance
    usort($item_attendances, function ($a, $b) {
        return $b['attendance'] <=> $a['attendance'];
    });

    // Return the sorted data
    return $item_attendances;
}

// Set headers to allow cross-origin requests and return JSON content
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Initialize the output with default values
$output = [
    "error" => false,
    "items" => [],
    "attendance" => [],
    "sorted_attendance" => []
];

// Define the expected attendance ranges
$attendanceRanges = [
    "attendance_1" => ["min" => 0, "max" => 33],
    "attendance_2" => ["min" => 0, "max" => 22],
    "attendance_3" => ["min" => 0, "max" => 44],
    "attendance_4" => ["min" => 0, "max" => 55]
];

// Collect and validate attendance data
for ($i = 1; $i <= 4; $i++) {
    $attendanceKey = "attendance_$i";
    $itemKey = "item_$i";

    if (!isset($_REQUEST[$attendanceKey]) || !isset($_REQUEST[$itemKey])) {
        $output["error"] = true;
        $output["message"] = "Missing attendance or item for $attendanceKey.";
        echo json_encode($output);
        exit;
    }

    $attendance = $_REQUEST[$attendanceKey];
    $item = $_REQUEST[$itemKey];

    if (empty($item)) {
        $output["error"] = true;
        $output["message"] = "Empty item for $attendanceKey.";
        echo json_encode($output);
        exit();
    }

    // Check if attendance is a numeric value and an integer
    if (!is_numeric($attendance) || (int)$attendance != $attendance) {
        $output["error"] = true;
        $output["message"] = "Invalid attendance value for $attendanceKey. Attendance should be an integer.";
        echo json_encode($output);
        exit();
    }

    // Convert the attendance to an integer
    $attendance = (int)$attendance;
    if ($attendance < $attendanceRanges[$attendanceKey]["min"] || $attendance > $attendanceRanges[$attendanceKey]["max"]) {
        $output["error"] = true;
        $output["message"] = "Invalid attendance value for $attendanceKey. Attendance should be an integer within the range [" . $attendanceRanges[$attendanceKey]["min"] . ", " . $attendanceRanges[$attendanceKey]["max"] . "].";
        echo json_encode($output);
        exit();
    }

    $output['items'][] = $item;
    $output['attendance'][] = $attendance;
}

// Get and process the sorted attendance
$sorted_attendance = getSortedAttendance($output['items'], $output['attendance']);

// Check for errors from getSortedAttendance
if (isset($sorted_attendance['error'])) {
    $output["error"] = true;
    $output["message"] = $sorted_attendance['error'];
} else {
    $output['sorted_attendance'] = $sorted_attendance;
}

// Return the final output
echo json_encode($output);
exit;
?>

