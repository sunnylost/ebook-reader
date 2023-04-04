import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
export default defineConfig(({ mode }) => {
    return {
        base: './',
        build: {
            emptyOutDir: true,
            outDir: 'build',
            polyfillDynamicImport: false,
            sourcemap: true,
            target: 'esnext',
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                    },
                },
            },
        },
        resolve: {
            alias: {
                '@': resolve(currentDirectory, 'src'),
            },
        },
        plugins: [solidPlugin()],
    }
})
