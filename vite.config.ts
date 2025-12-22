import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import tailwindcss from '@tailwindcss/vite'

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    server: {
        proxy: {
            '/api/players': {
                target: process.env.VITE_MAP_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/players/, '/tiles/players.json'),
            },
        },
    },
});
