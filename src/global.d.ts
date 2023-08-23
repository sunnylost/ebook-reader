/// <reference types="vite/client" />

import * as PdfJsLibType from 'pdfjs-dist'

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            clickOutside: () => void
        }
    }
}

declare global {
    const pdfjsLib: PdfJsLibType
}
