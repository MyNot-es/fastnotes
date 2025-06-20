import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    optimizeDeps: {
      include: ['tailwindcss', 'postcss']
    },
    define: {
      // Ensure environment variables are properly stringified
      __FIREBASE_CONFIG__: {
        apiKey: JSON.stringify(env.VITE_FIREBASE_API_KEY),
        authDomain: JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
        databaseURL: JSON.stringify(env.VITE_FIREBASE_DB_URL),
        projectId: JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
        storageBucket: JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
        messagingSenderId: JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
        appId: JSON.stringify(env.VITE_FIREBASE_APP_ID)
      }
    }
  }
})
