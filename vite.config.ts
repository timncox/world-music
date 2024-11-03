import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/.netlify/functions/auth': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/.netlify\/functions\/auth/, '/api/auth'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {
      NEXT_PUBLIC_NEXTAUTH_URL: process.env.VITE_NEXTAUTH_URL,
      NEXTAUTH_URL: process.env.VITE_NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.VITE_NEXTAUTH_SECRET,
      WORLD_APP_ID: process.env.VITE_WLD_APP_ID,
      WORLD_APP_SECRET: process.env.VITE_WLD_CLIENT_SECRET,
    },
  },
});