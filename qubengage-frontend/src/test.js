// test.js
const fetch = require('node-fetch');

describe('Service Failure Handler Tests', () => {
  const baseEndpoint = 'http://qubengage-proxy.40381868.qpc.hal.davecutting.uk/';
  const alternateEndpoint = "http://alternate-qubengage-proxy.40381868.qpc.hal.davecutting.uk/";

  const queryParams = new URLSearchParams({
    item_1: 'LectureSessions',
    attendance_1: '10',
    item_2: 'LabSessions',
    attendance_2: '20',
    item_3: 'SupportSessions',
    attendance_3: '30',
    item_4: 'CanvasActivities',
    attendance_4: '40',
    cutoff: '40'
  }).toString();

  it('should successfully fetch data from primary service', async () => {
    const response = await fetch(`${baseEndpoint}?service=maxmin&${queryParams}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('max_item');
  });

  it('should fallback to alternate URL when primary service fails', async () => {
    const response = await fetch(`${alternateEndpoint}?service=sorted&${queryParams}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('sorted_attendance');
  });

  it('should successfully fetch engagement score', async () => {
    const response = await fetch(`${baseEndpoint}?service=score&${queryParams}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });

  it('should successfully fetch risk assessment', async () => {
    const response = await fetch(`${baseEndpoint}?service=risk&${queryParams}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('risk');
  });

  it('should successfully fetch mean and median data', async () => {
    const response = await fetch(`${baseEndpoint}?service=meanmedian&${queryParams}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('mean_item');
    expect(data).toHaveProperty('median_item');
  });
});


