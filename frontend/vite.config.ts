import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false, // will try 5174, 5175 if 5173 is taken
    host: true // Expose to network (allows access from phone/other devices)
  }
})
