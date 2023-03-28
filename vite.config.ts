import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import solidPlugin from 'vite-plugin-solid'

import manifest from './src/manifest'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
export default defineConfig(({ mode }) => {
    const isBuildSite = mode === 'site'
    const extraConfigs = isBuildSite
        ? {}
        : {
              rollupOptions: {
                  input: {
                      welcome: 'src/chrome-addon/entries/welcome.html',
                  },
                  output: {
                      chunkFileNames: 'assets/chunk-[hash].js',
                  },
              },
          }
    const plugins = [
        isBuildSite ? null : crx({ manifest }),
        solidPlugin(),
    ].filter(Boolean)

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
            ...extraConfigs,
        },
        resolve: {
            alias: {
                '@': resolve(currentDirectory, 'src'),
            },
        },
        plugins,
    }
})
