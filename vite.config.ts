import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    'import.meta.env.VITE_REMOTE_SERVER': JSON.stringify(
      process.env.VITE_REMOTE_SERVER || 'http://localhost:4000'
    )
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_REMOTE_SERVER || 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
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
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'all'
    ]
  }
})
