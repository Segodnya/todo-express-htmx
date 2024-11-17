import request from 'supertest';
import app from '../index';

describe('Express App', () => {
    it('should respond to GET /', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Express + TypeScript Server');
    });
});
