import { http, HttpResponse } from 'msw';
import mockProfile from '../profiles.json';

export const handlers = [
  http.get('https://www.hunqz.com/api/opengrid/profiles/:name', ({ params }) => {
    return HttpResponse.json({ ...mockProfile, name: String(params.name) });
  }),
];
