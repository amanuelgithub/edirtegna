import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100, // check every 100ms
    },
    // host: true,
    host: '0.0.0.0', // save as host: true
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      // host: 'localhost',
    },
  },
});
