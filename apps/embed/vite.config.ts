import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Replace process.env.NODE_ENV for browser compatibility
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({}),
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'AEODomainInput',
      fileName: 'aeo-domain-input',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        // No external dependencies - bundle everything
      },
    },
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
  },
});
