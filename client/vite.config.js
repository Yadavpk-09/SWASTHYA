import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'automatic'
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
