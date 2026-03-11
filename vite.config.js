import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: canvia 'real-tiesada' pel nom exacte del teu repositori de GitHub
export default defineConfig({
  plugins: [react()],
  base: '/real-tiesada/',
})
