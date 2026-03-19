import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['libs/shared/images/src/**/*.spec.ts'],
    globals: true,
  },
});
