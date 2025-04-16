// alternate.js

const alternateProxyBaseURL = "http://alternate-qubengage-proxy.40381868.qpc.hal.davecutting.uk/";

const alternateConfig = {
    maxminURL: alternateProxyBaseURL + "?service=maxmin",
    sortedURL: alternateProxyBaseURL + "?service=sorted",
    totalURL: alternateProxyBaseURL + "?service=total",
    scoreURL: alternateProxyBaseURL + "?service=score",
    riskURL: alternateProxyBaseURL + "?service=risk",
    meanmedianURL: alternateProxyBaseURL + "?service=meanmedian"
};

if (!window.alternateConfig) {
    window.alternateConfig = alternateConfig;
}
