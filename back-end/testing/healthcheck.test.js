// Ensure dotenv is loaded
require('dotenv').config({ path: '../../.env' });

// Mock the DB to simulate a failure scenario
jest.mock('../utils/db', () => ({
  execute: jest.fn().mockRejectedValue(new Error('Database error')) // Simulate DB failure
}));

// Mock the auth middleware for the test
jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    if (req.headers['authorization'] !== 'Bearer valid-token') {
      return res.status(401).json({ status: 'failed' });
    }
    next();
  };
});

const request = require('supertest');
const express = require('express');
const healthcheckRouter = require('../api/admin/healthcheck');
const app = express();

app.use('/healthcheck', healthcheckRouter);

describe('Healthcheck API', () => {
  it('should return status 401 with JSON format by default when DB fails', async () => {
    const response = await request(app).get('/healthcheck')
      .set('Authorization', 'Bearer valid-token');
    expect(response.status).toBe(401);
    expect(response.body.status).toBe('failed');
    expect(response.body.db_connection).toBeTruthy(); //This should still return the connection string
  });

  it('should return status 401 with CSV format when requested and DB fails', async () => {
    const response = await request(app).get('/healthcheck?format=csv')
      .set('Authorization', 'Bearer valid-token');
    expect(response.status).toBe(401);
    expect(response.body.status).toBe('failed');
    expect(response.body.db_connection).toBeTruthy(); //This should still return the connection string
  });

  it('should return status 401 if the authentication token is invalid', async () => {
    const response = await request(app).get('/healthcheck')
      .set('Authorization', 'Bearer invalid-token');
    expect(response.status).toBe(401);
    expect(response.body.status).toBe('failed');
  });

  it('should return status 401 if the database query fails', async () => {
    const response = await request(app).get('/healthcheck')
      .set('Authorization', 'Bearer valid-token');
    expect(response.status).toBe(401);
    expect(response.body.status).toBe('failed');  // Ensure it matches the expected failure response
  });
});
