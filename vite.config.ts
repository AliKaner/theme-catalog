import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The showcase site builds to its own folder so it never clobbers the
  // publishable library output in `dist/` (see `npm run build:lib`).
  build: {
    outDir: 'site-dist',
  },
})
