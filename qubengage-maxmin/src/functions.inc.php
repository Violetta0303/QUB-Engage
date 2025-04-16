<?php

function getMaxMin($items, $attendances) 
{
    // Initialize the response array
    $response = array();

    // Data processing
    $max = max($attendances);
    $min = min($attendances);
    $maxIndex = array_search($max, $attendances);
    $minIndex = array_search($min, $attendances);
    $maxItem = $items[$maxIndex];
    $minItem = $items[$minIndex];

    // Build the return data
    $response['max_item'] = array('name' => $maxItem, 'attendance' => $max);
    $response['min_item'] = array('name' => $minItem, 'attendance' => $min);

    // Return the result
    return $response;
}

?>

