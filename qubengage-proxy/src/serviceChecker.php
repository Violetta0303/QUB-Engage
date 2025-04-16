<?php
// serviceChecker.php

set_time_limit(0); // Ensure the script doesn't timeout

$servicesFile = 'services.json'; // The path to the services file

// Function to fetch the current list of services from a JSON file
function fetchKnownServices($filePath) {
    // Check if the file exists and is readable
    if (!file_exists($filePath) || !is_readable($filePath)) {
        error_log("Unable to read services file at: $filePath");
        return [];
    }

    // Read the file contents and decode the JSON
    $jsonContents = file_get_contents($filePath);
    $services = json_decode($jsonContents, true);

    // Handle JSON errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('Error decoding JSON from services file: ' . json_last_error_msg());
        return [];
    }

    return $services;
}

// Function to check if a service is available by making an HTTP request
function isServiceAvailable($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Consider the service available if the HTTP status code is 200
    return $httpCode === 200;
}

// Function to update the services list based on availability
function updateServices($servicesFile) {
    // Fetch the current list of services
    $knownServices = fetchKnownServices($servicesFile);
    $updatedServices = [];

    // Check the availability of each service
    foreach ($knownServices as $serviceName => $serviceUrl) {
        if (isServiceAvailable($serviceUrl)) {
            // If the service is available, add it to the updated list
            $updatedServices[$serviceName] = $serviceUrl;
        }
    }

    // Write the updated list back to the file
    file_put_contents($servicesFile, json_encode($updatedServices, JSON_PRETTY_PRINT));
}

// Main loop for the service checker
while (true) {
    // Update the services based on the current list and availability
    updateServices($servicesFile);
    // Sleep for 60 seconds before the next check
    sleep(60);
}
?>