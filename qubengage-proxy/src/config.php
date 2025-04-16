<?php
// config.php

// Dynamically reads service information from services.json
function discoverServices() {
    $servicesFile = 'services.json'; // Path to the JSON file with service endpoints
    clearstatcache(true, $servicesFile); // Clear file status cache to ensure getting the latest file time

    // Try to read and parse the JSON file if it exists and is readable
    if (is_readable($servicesFile)) {
        $jsonContents = file_get_contents($servicesFile);
        $serviceEndpoints = json_decode($jsonContents, true);

        // Check for JSON errors
        if (json_last_error() === JSON_ERROR_NONE) {
            // If no errors, return the endpoints
            return $serviceEndpoints;
        } else {
            // Log error if there is an error decoding JSON
            error_log('Error decoding JSON from services file: ' . json_last_error_msg());
        }
    } else {
        // Log an error if the file doesn't exist, isn't readable, or couldn't get the modified time
        error_log('The services file is not readable or does not exist: ' . $servicesFile);
    }

    // Return an empty array if there was an issue
    return [];
}
?>
