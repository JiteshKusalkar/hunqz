/**
 * MSW mocks upstream hunqz.com for integration tests.
 * `onUnhandledRequest: 'bypass'` lets supertest hit localhost without extra config.
 */
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll } from 'vitest';

const mockProfile = {
  id: '41469841',
  name: 'msescortplus',
  online_status: 'ONLINE',
  headline: 'Test headline',
  preview_pic: {
    id: 'pv',
    url_token: 'token-preview',
    width: 100,
    height: 100,
    rating: 'NEUTRAL',
    is_public: true,
  },
  pictures: [
    { id: 'p1', url_token: 'token-1', width: 50, height: 50, rating: 'APP_SAFE', is_public: true },
  ],
};

const fakeJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

export const msw = setupServer(
  http.get('https://www.hunqz.com/api/opengrid/profiles/:name', ({ params }) =>
    HttpResponse.json({ ...mockProfile, name: String(params.name) }),
  ),
  http.get(
    'https://www.hunqz.com/img/usr/original/256x256/:file',
    () => new HttpResponse(fakeJpeg, { headers: { 'content-type': 'image/jpeg' } }),
  ),
);

beforeAll(() => msw.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => msw.resetHandlers());
afterAll(() => msw.close());
