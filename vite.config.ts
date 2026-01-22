import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './utils'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/', // ✅ Para custom domain usar '/', para github.io/repo usar '/repo/'
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Reduz tamanho do build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'sonner']
        }
      }
    }
  }
});