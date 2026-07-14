import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      components: path.resolve(rootDir, 'src/components'),
      features: path.resolve(rootDir, 'src/features'),
      store: path.resolve(rootDir, 'src/store'),
      hooks: path.resolve(rootDir, 'src/hooks'),
      layouts: path.resolve(rootDir, 'src/layouts'),
      pages: path.resolve(rootDir, 'src/pages'),
      router: path.resolve(rootDir, 'src/router'),
      schemas: path.resolve(rootDir, 'src/schemas'),
      theme: path.resolve(rootDir, 'src/theme'),
      config: path.resolve(rootDir, 'src/config'),
      assets: path.resolve(rootDir, 'src/assets'),
    },
  },
})
