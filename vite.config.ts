<<<<<<< HEAD
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
=======
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    target: 'esnext',
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  server: {
    cors: true,
  },
})
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
