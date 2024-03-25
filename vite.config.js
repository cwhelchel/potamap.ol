import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  build: {
    sourcemap: true,
  },
  base: '/potamap.ol/',
  server: { https: true },
  plugins: [ mkcert() ]
})
