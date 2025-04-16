<?php

// This file contains the getMeanMedian function used to calculate mean and median.

// Function to calculate mean and median
function getMeanMedian($attendances)
{
    // Initialize the response array
    $response = array();

    // Error handling: Check if input is an array and not empty
    if (!is_array($attendances) || empty($attendances)) {
        $response['error'] = 'Input error: Missing or incomplete input.';
        return $response;
    }

    // Error handling: Check if all values are numeric
    foreach ($attendances as $attendance) {
        if (!is_numeric($attendance)) {
            $response['error'] = 'Input error: Non-numeric input detected.';
            return $response;
        }
    }

    // Calculate mean
    $totalAttendance = array_sum($attendances);
    $response['mean'] = $totalAttendance / count($attendances);

    // Sort and calculate median
    sort($attendances);
    $middleIndex = floor(count($attendances) / 2);
    if (count($attendances) % 2) {
        $response['median'] = $attendances[$middleIndex];
    } else {
        $response['median'] = ($attendances[$middleIndex - 1] + $attendances[$middleIndex]) / 2;
    }

    // Return the results
    return $response;
}

