<?php
// index.php

header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");

require 'config.php'; // Include the service endpoints configuration.

$serviceEndpoints = discoverServices(); // Discover services.

// Function to make a GET request.
function makeGETRequest($url, $queryParams) {
    $ch = curl_init();
    $urlWithParams = $url . '?' . http_build_query($queryParams);
    curl_setopt($ch, CURLOPT_URL, $urlWithParams);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode != 200) {
        error_log("Proxy request error: $urlWithParams - HTTP status code: $httpCode");
        $decodedResponse = json_decode($response, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return json_encode($decodedResponse);
        } else {
            return $response;
        }
    }

    return $response;
}

// Get the service parameter from the query string
$service = $_GET['service'] ?? null;

// Remove the service parameter from the query parameters
// as it's not needed for the forwarded request.
unset($_GET['service']);

// Check if the service parameter exists in the service endpoints array.
if ($service && isset($serviceEndpoints[$service])) {
    $serviceUrl = $serviceEndpoints[$service]; // Get the service URL.
    $response = makeGETRequest($serviceUrl, $_GET); // Make the GET request with additional query params.

    header('Content-Type: application/json'); // Set the content type to JSON.
    echo $response; // Output the response.
} else {
    http_response_code(404); // If service parameter is not found, return a 404 response.
    echo json_encode(['error' => true, 'message' => 'Service parameter not found or service endpoint not defined.']);
}
?>
