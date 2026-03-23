import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://www.hunqz.com/img/usr/original/0x0/:file', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: { 'content-type': 'image/jpeg' },
    });
  }),
];
