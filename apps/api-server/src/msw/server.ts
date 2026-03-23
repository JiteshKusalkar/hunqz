import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll } from 'vitest';
import mockProfile from './mocks/profiles.json';

export const msw = setupServer(
  http.get('https://www.hunqz.com/api/opengrid/profiles/:name', ({ params }) =>
    HttpResponse.json({ ...mockProfile, name: String(params.name) }),
  ),
  http.get(
    'https://www.hunqz.com/img/usr/original/0x0/:file',
    () => new HttpResponse(null, { status: 200, headers: { 'content-type': 'image/jpeg' } }),
  ),
);

beforeAll(() => msw.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => msw.resetHandlers());
afterAll(() => msw.close());
