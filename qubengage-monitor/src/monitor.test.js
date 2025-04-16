// monitor.test.js
const chai = require('chai');
const sinon = require('sinon');
const http = require('http');
const { expect } = chai;

// Import the functions and transporter object to be tested
const { sendAlert, checkServiceStatus, transporter } = require('./monitor');

// Create a test suite
describe('Monitor Service Tests', () => {
  // Create a stub for transporter.sendMail
  let sendMailStub;

  beforeEach(() => {
    // Create a new stub before each test case
    sendMailStub = sinon.stub(transporter, 'sendMail');
  });

  afterEach(() => {
    // Restore the stub after each test case
    sendMailStub.restore();
  });

  afterEach(() => {
    // Restore the original behavior of http.get after each test case
    sinon.restore();
  });

  it('should send an email alert', () => {
    // Mock the sendMail function to avoid actually sending an email
    sendMailStub.yields(null, { response: 'Email sent' });

    // Call the sendAlert function
    const testService = { name: 'Test Service', url: '#' };
    sendAlert(testService);

    // Assert that sendMailStub was called and returned the correct arguments
    expect(sendMailStub.calledOnce).to.be.true;
    expect(sendMailStub.firstCall.args[0]).to.deep.include({
      from: process.env.EMAIL,
      to: process.env.ALERT_RECIPIENT,
      subject: 'Service Alert: Test Service',
      text: 'Alert: Test Service is down or responding slowly.'
    });
  });

  it('should check the service status and return UP for HTTP 200 response', (done) => {
    // Mock http.get to return an HTTP 200 response
    sinon.stub(http, 'get').callsFake((url, callback) => {
      const fakeResponse = { statusCode: 200 };
      callback(fakeResponse);
    });
  
    // Call the checkServiceStatus function
    const testService = { name: 'Test Service', url: 'http://example.com' };
    checkServiceStatus(testService, (error, status) => {
      expect(error).to.be.null;
      expect(status.isUp).to.be.true;
      expect(status.responseTime).to.be.a('number'); // Use this assertion to check if responseTime is of type number
      done();
    });
  });  

  it('should check the service status and return DOWN for HTTP 500 response', (done) => {
    // Mock http.get to return an HTTP 500 response
    sinon.stub(http, 'get').callsFake((url, callback) => {
      const fakeResponse = { statusCode: 500 };
      callback(fakeResponse);
    });
  
    // Call the checkServiceStatus function
    const testService = { name: 'Test Service', url: 'http://example.com' };
    checkServiceStatus(testService, (error, status) => {
      expect(error).to.be.null;
      expect(status.isUp).to.be.false;
      done(); // Call done() here to end the test
    });
  });  
});