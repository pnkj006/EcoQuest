import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleGenerateQuestRequest } from './server/questApiHandler.js';

export default defineConfig(({ mode }) => {
  // Load server-side environment variables from .env
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [
      react(),
      {
        name: 'ecoquest-api-server',
        configureServer(server) {
          server.middlewares.use('/api/generate-quest', (req, res) => {
            handleGenerateQuestRequest(req, res);
          });
        }
      }
    ],
    server: {
      port: 5173,
      open: false
    }
  };
});
