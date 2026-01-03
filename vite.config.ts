import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Configuration Vite pour PharmaGN Frontend.
 * Configure le serveur de développement, le build et les alias.
 */
export default defineConfig({
    // Plugin React avec Fast Refresh
    plugins: [react()],

    // Alias de chemins pour imports propres
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    // Configuration du serveur de développement
    server: {
        port: 5173,

        // Proxy API vers Django backend
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            },
        },
    },

    // Configuration du build de production
    build: {
        outDir: 'dist',
        sourcemap: true,

        // Optimisation du chunking
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                },
            },
        },
    },
})
