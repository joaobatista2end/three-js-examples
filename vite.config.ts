import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 1000, // Size in kB
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'three-examples': ['three/examples/jsm/geometries/TextGeometry', 'three/examples/jsm/loaders/FontLoader']
        }
      }
    }
  }
})
