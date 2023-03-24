import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import solidPlugin from 'vite-plugin-solid'

import manifest from './src/manifest'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
export default defineConfig(({ mode }) => {
    return {
        build: {
            emptyOutDir: true,
            outDir: 'build',
            target: 'esnext',
            polyfillDynamicImport: false,
            rollupOptions: {
                input: {
                    welcome: 'src/chrome-addon/entries/welcome.html',
                },
                output: {
                    chunkFileNames: 'assets/chunk-[hash].js',
                },
            },
        },
        resolve: {
            alias: {
                '@': resolve(currentDirectory, 'src'),
            },
        },
        plugins: [crx({ manifest }), solidPlugin()],
    }
})
