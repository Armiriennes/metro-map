import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // Charge les variables d'environnement du fichier .env
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            tailwindcss()
        ],
        server: {
            proxy: {
                // Proxy pour les données API (players, etc.)
                '/api/players': {
                    target: env.VITE_MAP_URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api\/players/, '/tiles/players.json'),
                },
                // Proxy pour récupérer les tuiles (images) de la carte
                '/tiles': {
                    target: env.VITE_MAP_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});