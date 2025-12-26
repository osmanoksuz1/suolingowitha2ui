import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@screens': resolve(__dirname, './src/screens'),
      '@context': resolve(__dirname, './src/context'),
      '@services': resolve(__dirname, './src/services'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@styles': resolve(__dirname, './src/styles'),
      '@utils': resolve(__dirname, './src/utils'),
      '@assets': resolve(__dirname, './src/assets'),
    },
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
  },
  
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    'process.env': {},
  },
  
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
