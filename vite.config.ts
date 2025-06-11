import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_REMOTE_SERVER || 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4000,
    strictPort: false,
    allowedHosts: [
      'kambaz-react-web-app-cs5610-sm25.onrender.com',
      '.onrender.com',
      '.netlify.app',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'all'
    ]
  }
})
