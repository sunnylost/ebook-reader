import { globalConfig, updateGlobalConfig } from '@/stores'
import { Mode } from '@/types'

export async function monitorSystemColorSchemeChange() {
    const { globalConfig, updateGlobalConfig } = await import('@/stores')

    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', ({ matches }) => {
            if (globalConfig.mode === Mode.system) {
                updateGlobalConfig({
                    currentColorScheme: matches ? Mode.dark : Mode.light,
                })
            }
        })
}

export function getCurrentSystemColorScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? Mode.dark
        : Mode.light
}
