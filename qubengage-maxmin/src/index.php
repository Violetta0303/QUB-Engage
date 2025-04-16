<?php
header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");

// Include the functions.inc.php file where the getMaxMin function is defined
require('functions.inc.php');

// Initialize the output array with default values
$output = array(
    "error" => false,
    "items" => array(),
    "attendance" => array(),
    "max_item" => null,
    "min_item" => null
);

// Define the expected attendance ranges
$attendanceRanges = array(
    "attendance_1" => array("min" => 0, "max" => 33),
    "attendance_2" => array("min" => 0, "max" => 22),
    "attendance_3" => array("min" => 0, "max" => 44),
    "attendance_4" => array("min" => 0, "max" => 55)
);

$items = array();
$attendances = array();

// Collect and validate attendance and item inputs
foreach ($attendanceRanges as $key => $range) {
    if (!isset($_REQUEST[$key]) || !isset($_REQUEST['item_' . substr($key, -1)])) {
        $output["error"] = true;
        $output["message"] = "Missing attendance or item for $key.";
        echo json_encode($output);
        exit();
    }

    $attendance = $_REQUEST[$key];
    $item = $_REQUEST['item_' . substr($key, -1)];

    // Check if the item is empty
    if (empty($item)) {
        $output["error"] = true;
        $output["message"] = "Empty item for $key.";
        echo json_encode($output);
        exit();
    }

    // Check if attendance is a numeric value and an integer
    if (!is_numeric($attendance) || !filter_var($attendance, FILTER_VALIDATE_INT)) {
        $output["error"] = true;
        $output["message"] = "Invalid attendance value for $key. Attendance should be an integer.";
        echo json_encode($output);
        exit();
    }

    // Check if attendance is within the specified range
    $attendance = (int)$attendance;
    if ($attendance < $range["min"] || $attendance > $range["max"]) {
        $output["error"] = true;
        $output["message"] = "Invalid attendance value for $key. Attendance should be an integer within the range [{$range["min"]}, {$range["max"]}].";
        echo json_encode($output);
        exit();
    }

    $items[] = $item;
    $attendances[] = $attendance;
}

// Calculate max and min items and attendances
$max_min_response = getMaxMin($items, $attendances);

if(isset($max_min_response['error'])) {
    // If there is an error in the response, output it
    $output['error'] = true;
    $output['message'] = $max_min_response['error'];
} else {
    // Otherwise, set the max and min items and attendances in the output
    $output['items'] = $items;
    $output['attendance'] = $attendances;
    $output['max_item'] = $max_min_response['max_item'];
    $output['min_item'] = $max_min_response['min_item'];
}

echo json_encode($output);
exit();
?>

