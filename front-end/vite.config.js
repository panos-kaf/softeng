import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../back-end/cert/localhost-key.pem'),
      cert: fs.readFileSync('../back-end/cert/localhost-cert.pem'),
    },
    host: 'localhost',
    port: 5173, // Ensure this matches your frontend port
  },
})