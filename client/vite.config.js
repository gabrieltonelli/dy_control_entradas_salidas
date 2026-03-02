import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.VITE_PORT) || 5173

  return {
    plugins: [react()],
    server: {
      port,
      // host: true  <-- Habilitar esto expone el servidor en toda la red.
      //               Usá start-mobile.bat para ese caso.
    },
  }
})
