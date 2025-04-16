// config.js

const proxyBaseURL = "http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/";

const config = {
    // maxminURL: "http://qubengage-maxmin.40381868.qpc.hal.davecutting.uk/",
    // sortedURL: "http://qubengage-sort.40381868.qpc.hal.davecutting.uk/",
    // totalURL: "http://qubengage-total.40381868.qpc.hal.davecutting.uk/",
    // scoreURL: "http://qubengage-score.40381868.qpc.hal.davecutting.uk/",
    // riskURL: "http://qubengage-risk.40381868.qpc.hal.davecutting.uk/",
    // meanmedianURL: "https://europe-west2-cloud-405120.cloudfunctions.net/qubengage-meanmedian/"
    maxminURL: proxyBaseURL + "?service=maxmin",
    sortedURL: proxyBaseURL + "?service=sorted",
    totalURL: proxyBaseURL + "?service=total",
    scoreURL: proxyBaseURL + "?service=score",
    riskURL: proxyBaseURL + "?service=risk",
    meanmedianURL: proxyBaseURL + "?service=meanmedian"
};

// Attach the config object to the window if it's not already present
if (!window.config) {
    window.config = config;
}
