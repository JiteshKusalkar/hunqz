import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

/** supertest → Express; MSW mocks upstream (see msw-setup.ts). */
describe('api-server', () => {
  it('GET /profiles/:name returns profile with image URLs on our API host', async () => {
    const res = await request(app).get('/profiles/msescortplus');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('msescortplus');
    expect(res.body.previewImage.imageUrl).toContain('/images/256x256/');
    expect(res.body.previewImage.imageUrl).toMatch(/\.jpg$/);
  });

  it('GET /images/256x256/:token.jpg proxies image from CDN', async () => {
    const res = await request(app).get('/images/256x256/anytoken.jpg');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/image\/jpeg/);
  });

  it('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
