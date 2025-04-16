<?php
header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");
require('functions.inc.php');

$output = array(
    "error" => false,
    "items" => "",
    "attendance" => 0,
    "sorted_attendance" => ""
);

// Define the expected attendance ranges
$attendanceRanges = array(
    "attendance_1" => array("min" => 0, "max" => 33),
    "attendance_2" => array("min" => 0, "max" => 22),
    "attendance_3" => array("min" => 0, "max" => 44),
    "attendance_4" => array("min" => 0, "max" => 55)
);

// Collect and validate attendance data
for ($i = 1; $i <= 4; $i++) {
    $attendanceKey = "attendance_$i";
    $itemKey = "item_$i";

    // Check for missing attendance or item
    if (!isset($_REQUEST[$attendanceKey]) || !isset($_REQUEST[$itemKey])) {
        $output["error"] = true;
        $output["message"] = "Missing attendance or item for $attendanceKey.";
        echo json_encode($output);
        exit;
    }

    $attendance = $_REQUEST[$attendanceKey];
    $item = $_REQUEST[$itemKey];

    // Check if the item is empty
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

    // Convert the attendance to an integer and check if it is within the specified range
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

$sorted_attendance = getSortedAttendance($output['items'], $output['attendance']);

$output['sorted_attendance'] = $sorted_attendance;

echo json_encode($output);
exit();
?>


