<?php
// test.php

function testService($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        echo "Service at $url responded with 200 OK.\n";
    } else {
        echo "Service at $url responded with error code: $httpCode.\n";
    }
}

// Add the URLs of your services here
$services = [
    "http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/?service=maxmin",
    "http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/?service=sorted",
    "http://qubengage-total.40381868.qpc.hal.davecutting.uk/",
    "http://qubengage-score.40381868.qpc.hal.davecutting.uk/",
    "http://qubengage-risk.40381868.qpc.hal.davecutting.uk/",
    "https://europe-west2-cloud-405120.cloudfunctions.net/qubengage-meanmedian/"
];

foreach ($services as $service) {
    testService($service);
}
?>
