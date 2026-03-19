import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

const hunqzApiProxy = {
  '/api': {
    target: 'https://www.hunqz.com',
    changeOrigin: true,
    secure: true,
  },
} as const;

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web-react',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: hunqzApiProxy,
  },
  preview: {
    port: 4200,
    host: 'localhost',
    proxy: hunqzApiProxy,
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    outDir: '../../dist/apps/web-react',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
