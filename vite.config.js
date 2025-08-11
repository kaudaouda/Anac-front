import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pug from 'vite-plugin-pug'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pug()],
})
