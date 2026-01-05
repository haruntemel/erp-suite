import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Tüm /api isteklerini backend'e yönlendir
      '/api': {
        target: 'http://localhost:5217', // Backend portunu buraya yaz
        changeOrigin: true,
        secure: false,
      },
    },
  },
})