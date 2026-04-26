import request from 'supertest';
import app from '../src/index';
import axios from 'axios';
import { vi } from 'vitest';

describe('nearest booth endpoint (mocked)', () => {
  const sampleResp = {
    results: [
      {
        name: 'Polling Station A',
        place_id: 'abc123',
        vicinity: 'Near Park',
        geometry: { location: { lat: 28.61, lng: 77.20 } }
      }
    ]
  };

  beforeAll(() => {
    vi.spyOn(axios, 'get').mockResolvedValue({ data: sampleResp } as any);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('returns nearest booths when MAPS key present (mocked axios)', async () => {
    // set env var for this process
    process.env.MAPS_API_KEY = 'test-key';
    const res = await request(app).get('/api/nearest-booth?lat=28.6139&lng=77.2090');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results[0]).toHaveProperty('name', 'Polling Station A');
  });
});
