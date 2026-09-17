import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            tailwindcss()
        ],
        server: {
            proxy: {
                '/api/players': {
                    target: env.VITE_MAP_URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api\/players/, '/tiles/players.json'),
                },
                '/tiles': {
                    target: env.VITE_MAP_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});