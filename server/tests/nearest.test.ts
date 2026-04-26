import axios from 'axios';
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { findNearestBooths } from '../src/index';

describe('nearest booth logic (mocked)', () => {
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
    process.env.MAPS_API_KEY = 'test-key';
    const results = await findNearestBooths(28.6139, 77.2090);
    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('name', 'Polling Station A');
  });
});
