/// <reference types="vite/client" />

import type { JSX } from 'solid-js'

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            clickOutside: () => void
        }
    }
}
