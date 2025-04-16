const request = require('supertest');
const { app } = require('./index'); // Assuming index.js is in the same directory

describe('GET /', () => {
  it('responds with json containing the risk assessment', async () => {
    const attendances = {
      attendance_1: '30',
      attendance_2: '20',
      attendance_3: '40',
      attendance_4: '50',
    };
    const cutoff = '60';

    const response = await request(app)
      .get('/')
      .query({ ...attendances, cutoff })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('error', false);
    expect(response.body).toHaveProperty('risk');
    expect(response.body).toHaveProperty('engagementScore');
  });

  it('responds with an error for missing input', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error', true);
    expect(response.body).toHaveProperty('message', 'Missing or incomplete input.');
  });

});



