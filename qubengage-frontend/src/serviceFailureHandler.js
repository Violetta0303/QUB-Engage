// serviceFailureHandler.js
// This script attempts to make a GET request to the primary service URL,
// and if it fails, it retries with a alternate URL.

// Importing the URLs from the config.js and alternate.js
const serviceEndpoints = {
    maxmin: [config.maxminURL, alternateConfig.maxminURL],
    sorted: [config.sortedURL, alternateConfig.sortedURL],
    total: [config.totalURL, alternateConfig.totalURL],
    score: [config.scoreURL, alternateConfig.scoreURL],
    risk: [config.riskURL, alternateConfig.riskURL],
    meanmedian: [config.meanmedianURL, alternateConfig.meanmedianURL]
};

function makeGETRequestWithLoadBalancingAndFailover(serviceName, queryParams, successCallback, errorCallback) {
    const urls = [...serviceEndpoints[serviceName]]; // Clone the array to avoid mutating the original
    let attempts = urls.length;

    function tryNextURL() {
        if (attempts <= 0) {
            errorCallback("All service endpoints are unavailable.");
            return;
        }

        // Randomly select an index and remove the URL from the list
        const randomIndex = Math.floor(Math.random() * urls.length);
        const url = urls.splice(randomIndex, 1) + "&" + queryParams;

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    successCallback(JSON.parse(this.responseText));
                } else {
                    var errorResponse;
                    try {
                        // Attempt to parse the error response
                        errorResponse = JSON.parse(this.responseText);
                    } catch (e) {
                        // If there are still URLs left to try, go to the next one
                        attempts--;
                        tryNextURL();
                        return;
                    }

                    // Display the error message if it exists
                    if (errorResponse && errorResponse.message) {
                        errorCallback(errorResponse.message);
                    } else {
                        // If there are still URLs left to try, go to the next one
                        attempts--;
                        tryNextURL();
                    }
                }
            }
        };
        xhttp.onerror = function() {
            // If there are still URLs left to try, go to the next one
            attempts--;
            tryNextURL();
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

    tryNextURL();
}

