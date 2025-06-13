import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    'import.meta.env.VITE_REMOTE_SERVER': JSON.stringify(
      process.env.VITE_REMOTE_SERVER || 'https://kambaz-node-server-app-cs5610-sm25.onrender.com'
    )
  },
  server: {
    port: 5173,
    host: true
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
