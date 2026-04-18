import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

// When using HTTPS tunnels (ngrok, etc.), set in .env:
// VITE_DEV_SERVER_PUBLIC_URL=https://your-subdomain.ngrok-free.app
// and tunnel port 5173, or use `npm run build:ngrok` and skip `npm run dev`.
const devServerPublicUrl = process.env.VITE_DEV_SERVER_PUBLIC_URL;

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: devServerPublicUrl
        ? {
              host: '0.0.0.0',
              origin: devServerPublicUrl,
              strictPort: true,
              hmr: {
                  host: new URL(devServerPublicUrl).hostname,
                  protocol: 'wss',
                  clientPort: 443,
              },
          }
        : undefined,
});
