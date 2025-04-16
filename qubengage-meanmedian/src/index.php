<?php

// Include the CORS headers for cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include the function definitions from functions.inc.php
require('functions.inc.php');

// Initialize the output array
$output = array(
    "error" => false,
    "items" => array(),
    "attendance" => array(),
    "mean_item" => "",
    "median_item" => ""
);

// Define the expected attendance ranges
$attendanceRanges = array(
    "attendance_1" => array("min" => 0, "max" => 33),
    "attendance_2" => array("min" => 0, "max" => 22),
    "attendance_3" => array("min" => 0, "max" => 44),
    "attendance_4" => array("min" => 0, "max" => 55)
);

// Loop through each attendance range
foreach ($attendanceRanges as $key => $range) {
    if (!isset($_REQUEST[$key]) || !isset($_REQUEST['item_' . substr($key, -1)])) {
        $output["error"] = true;
        $output["message"] = "Missing attendance or item for $key.";
        echo json_encode($output);
        exit();
    }

    $attendance = $_REQUEST[$key];
    $item = $_REQUEST['item_' . substr($key, -1)];

    if (empty($item)) {
        $output["error"] = true;
        $output["message"] = "Empty item for $key.";
        echo json_encode($output);
        exit();
    }

    if (!is_numeric($attendance) || !filter_var($attendance, FILTER_VALIDATE_INT)) {
        $output["error"] = true;
        $output["message"] = "Invalid attendance value for $key. Attendance should be an integer.";
        echo json_encode($output);
        exit();
    }

    $attendance = (int)$attendance;
    if ($attendance < $range["min"] || $attendance > $range["max"]) {
        $output["error"] = true;
        $output["message"] = "Invalid attendance value for $key. Attendance should be an integer within the range [{$range["min"]}, {$range["max"]}].";
        echo json_encode($output);
        exit();
    }

    $output['items'][] = $item;
    $output['attendance'][] = $attendance;
}

$meanMedianResponse = getMeanMedian($output['attendance']);

if (isset($meanMedianResponse['error'])) {
    $output["error"] = true;
    $output["message"] = $meanMedianResponse['error'];
} else {
    $output['mean_item'] = $meanMedianResponse['mean'];
    $output['median_item'] = $meanMedianResponse['median'];
}

echo json_encode($output);
exit();

?>