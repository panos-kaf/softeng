const request = require('supertest');
const express = require('express');
const passesCostController = require('../controllers/passesCost'); // Import the controller
const app = express();
const router = express.Router(); // Create a router instance

app.use(express.json()); // Add this line to parse JSON request bodies

// Define the route on the router
router.get('/:tollOpID/:tagOpID/:date_from/:date_to', passesCostController.getPassesCost);

// Mount the router on the app
app.use('/passesCost', router);

// Mock the database connection
jest.mock('../utils/db', () => ({
    execute: jest.fn()
}));

// Mock the logger
jest.mock('../utils/logToFile', () => ({
    logToBothErr: jest.fn()
}));

const db = require('../utils/db');
const { logToBothErr } = require('../utils/logToFile');


describe('Passes Cost API', () => {
    const tollOpID = 'testToll';
    const tagOpID = 'testTag';
    const date_from = '20241110';
    const date_to = '20241112';
    const endpoint = `/passesCost/${tollOpID}/${tagOpID}/${date_from}/${date_to}`;

    beforeEach(() => {
        db.execute.mockClear();
        logToBothErr.mockClear();
    });

    it('should return 200 with correct JSON response', async () => {
        db.execute.mockResolvedValue([[{ nPasses: 10, passesCost: 150.50 }]]);

        const response = await request(app).get(endpoint);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            tollOpID: tollOpID,
            tagOpID: tagOpID,
            nPasses: 10,
            passesCost: 150.50,
        }));
        expect(db.execute).toHaveBeenCalledTimes(1);
    });

    it('should return 200 with correct CSV response', async () => {
        db.execute.mockResolvedValue([[{ nPasses: 10, passesCost: 150.50 }]]);

        const response = await request(app).get(`${endpoint}?format=csv`);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/csv; charset=utf-8');
        expect(response.headers['content-disposition']).toBe('attachment; filename=healthcheck.csv');
        expect(db.execute).toHaveBeenCalledTimes(1);
    });

    it('should return 204 if no passes found', async () => {
        db.execute.mockResolvedValue([[]]);

        const response = await request(app).get(endpoint);

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});  // Or expect({message: 'No content'}) if your route returns that explicitly
        expect(db.execute).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for invalid date format', async () => {
        const invalidDateFrom = 'invalid-date';
        const invalidEndpoint = `/passesCost/${tollOpID}/${tagOpID}/${invalidDateFrom}/${date_to}`; // Corrected endpoint

        const response = await request(app).get(invalidEndpoint);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid date range' });
        expect(db.execute).not.toHaveBeenCalled(); // Ensure db is not called
    });

    it('should return 500 for database error', async () => {
        db.execute.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get(endpoint);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal Server Error' });
        expect(db.execute).toHaveBeenCalledTimes(1);
        expect(logToBothErr).toHaveBeenCalled();
    });

     it('should handle zero passesCost correctly', async () => {
        db.execute.mockResolvedValue([[{ nPasses: 5, passesCost: null }]]); // or undefined, depending on what your DB returns

        const response = await request(app).get(endpoint);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            tollOpID: tollOpID,
            tagOpID: tagOpID,
            nPasses: 5,
            passesCost: 0.0,
        }));
        expect(db.execute).toHaveBeenCalledTimes(1);
    });
});
