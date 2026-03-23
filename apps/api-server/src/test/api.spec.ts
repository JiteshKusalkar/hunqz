import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('api-server', () => {
  it('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /profiles/:name', async () => {
    const res = await request(app).get('/profiles/msescortplus');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('msescortplus');
    expect(res.body.previewImage.imageUrl).toMatch(/\/images\/.+/);
  });

  it('GET /images/:token', async () => {
    const res = await request(app).get('/images/foo.jpg');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/jpeg/);
  });
});
