// monitor.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());

// List of services to monitor
const services = [
  { name: 'Maxmin', url: 'http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/?service=maxmin' },
  { name: 'Sort', url: 'http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/?service=sorted' },
  { name: 'Total', url: 'http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/?service=total' },
  { name: 'Score', url: 'http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/?service=score' },
  { name: 'Risk', url: 'http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/?service=risk' },
  { name: 'MeanMedian', url: 'http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/?service=meanmedian' },
];

// Create a mail transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Email address from environment variable
    pass: process.env.EMAIL_PASSWORD // Email password from environment variable
  }
});

// Function to send a test email at startup
function sendTestEmail() {
    const testService = { name: 'Test Service', url: '#' };
    console.log('Sending test email...');
    sendAlert(testService);
}

// Function to send an alert email
function sendAlert(service) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.ALERT_RECIPIENT, // Email address of the alert recipient
    subject: `Service Alert: ${service.name}`,
    text: `Alert: ${service.name} is down or responding slowly.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Failed to send alert for ${service.name}:`, error);
    } else {
      console.log(`Alert sent for ${service.name}:`, info.response);
    }
  });
}

// Use an object to keep track of service statuses
let serviceStatuses = {};

// Function to check the status of a service and update `serviceStatuses`
function checkServiceStatus(service, callback) {
  const startTime = Date.now();

  http.get(service.url, (res) => {
    const statusCode = res.statusCode;
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    serviceStatuses[service.name] = {
      isUp: statusCode === 200,
      responseTime: responseTime,
    };

    if (callback) {
      callback(null, serviceStatuses[service.name]);
    }
  }).on('error', (e) => {
    serviceStatuses[service.name] = {
      isUp: false,
      responseTime: null,
    };
    if (callback) {
      callback(e, serviceStatuses[service.name]);
    }
  });
}

// Function to periodically check the status of all services
function monitorServices() {
  services.forEach((service) => {
    checkServiceStatus(service);
  });
}

// Execute the monitoring function every minute
setInterval(monitorServices, 60000);

// Send a test email when the script starts
sendTestEmail();

// Root route
app.get('/', (req, res) => {
  res.send('Service monitor backend is running.');
});

// Route to check the status of all services
app.get('/check-status/all', (req, res) => {
  res.json(Object.values(serviceStatuses));
});

// Route to check the status of a specific service
app.get('/check-status/:serviceName', (req, res) => {
  const serviceName = req.params.serviceName;
  const service = services.find((s) => s.name === serviceName);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  checkServiceStatus(service, (error, status) => {
    if (error) {
      return res.status(503).json({ error: 'Service is down' });
    }
    res.json(status);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

module.exports = {
  sendAlert,
  checkServiceStatus,
  transporter
};