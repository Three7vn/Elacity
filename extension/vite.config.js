import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        contentScript: resolve(__dirname, 'src/contentScript.js'),
        background: resolve(__dirname, 'src/background.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'contentScript') {
            return 'contentScript.js';
          }
          if (chunkInfo.name === 'background') {
            return 'src/background.js';
          }
          return '[name].[hash].js';
        },
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  publicDir: 'public'
});