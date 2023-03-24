import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
    name: 'ebook-reader',
    description: '',
    version: '0.0.0',
    manifest_version: 3,
    icons: {
        16: 'img/logo-16.png',
        32: 'img/logo-34.png',
        48: 'img/logo-48.png',
        128: 'img/logo-128.png',
    },
    action: {
        default_icon: 'img/logo-48.png',
        default_title: 'Click to open reader',
    },
    options_page: 'src/chrome-addon/entries/options.html',
    background: {
        service_worker: 'src/chrome-addon/background/index.ts',
        type: 'module',
    },
    content_scripts: [
        {
            matches: ['http://*/*', 'https://*/*'],
            js: ['src/chrome-addon/content.tsx'],
        },
    ],
    web_accessible_resources: [
        {
            resources: [
                'img/logo-16.png',
                'img/logo-34.png',
                'img/logo-48.png',
                'img/logo-128.png',
            ],
            matches: [],
        },
    ],
    permissions: ['tabs'],
})
