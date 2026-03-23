import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['libs/images/src/**/*.spec.ts'],
    globals: true,
    passWithNoTests: true,
  },
});
