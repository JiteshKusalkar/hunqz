import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@hunqz/shared/api': resolve(__dirname, '../../libs/shared/api/src/index.ts'),
      '@hunqz/shared/images/server': resolve(__dirname, '../../libs/shared/images/src/server.ts'),
      '@hunqz/shared/images': resolve(__dirname, '../../libs/shared/images/src/index.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['apps/api-server/src/**/*.spec.ts'],
    globals: true,
    setupFiles: ['apps/api-server/src/test/msw-setup.ts'],
    env: {
      API_PUBLIC_URL: 'http://localhost:3333',
      HUNQZ_API_BASE_URL: 'https://www.hunqz.com',
      HUNQZ_IMAGE_CDN_BASE_URL: 'https://www.hunqz.com/img/usr/original/0x0',
      CORS_ORIGINS: 'http://localhost:3000,http://localhost:4200',
    },
  },
});
