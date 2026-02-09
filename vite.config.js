import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    allowedHosts: ['payg.rfpministries.com'],
    proxy: {
      '/api/auth': {
        target: 'http://wannie18-002-site3.btempurl.com/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/auth/, ''),
        headers: {
          'Connection': 'keep-alive',
        }
      },
      '/api/data': {
        target: 'http://wannie18-002-site2.btempurl.com/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/data/, ''),
      },
    },
  },
  preview: {
    allowedHosts: ['payg.rfpministries.com'],
  },
});