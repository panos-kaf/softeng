import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

import dotenv from 'dotenv'

dotenv.config({ path: '../.env'})

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../back-end/cert/selfsigned.key'),
      cert: fs.readFileSync('../back-end/cert/selfsigned.crt'),
    },
    host: process.env.VITE_HOST_IP,
    port: process.env.VITE_PORT
  },
})