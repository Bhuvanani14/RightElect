import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('server API smoke', () => {
  it('GET / should return status 200 and project field', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('project');
  });

  it('GET /api/parliament should return lokSabha and rajyaSabha', async () => {
    const res = await request(app).get('/api/parliament');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('lokSabha');
    expect(res.body).toHaveProperty('rajyaSabha');
  });

  it('GET /api/states should return count and items', async () => {
    const res = await request(app).get('/api/states');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('count');
    expect(res.body).toHaveProperty('items');
  });
});
