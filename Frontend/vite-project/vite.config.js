import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // We keep 'host: true' so you can still use your local IP if needed,
    // but the extra security settings for Pinggy are removed.
    host: true, 
  }
})