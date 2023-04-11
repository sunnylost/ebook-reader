import { createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'
import { backupGlobalConfig, retrieveGlobalConfig } from '@/utils'
import { GlobalConfig } from '@/types'

export const [globalConfig, updateGlobalConfig] = createStore<GlobalConfig>(
    retrieveGlobalConfig()
)

const styleElement = document.createElement('style')
document.body.appendChild(styleElement)

createEffect(() => {
    generateStyle(globalConfig)
    backupGlobalConfig(globalConfig)
})

function generateStyle(globalConfig: GlobalConfig) {
    if (!globalConfig) {
        return
    }

    styleElement.innerHTML = `
    .book .book-content * {
        font-size: ${globalConfig.fontSize}px;
    }
    `.trim()
}

generateStyle(globalConfig)

export function getGlobalFont() {
    return globalConfig.fontSize
}

export function updateGlobalFont(font: number) {
    updateGlobalConfig({
        ...globalConfig,
        fontSize: font,
    })
}

const [tocOpenedState, updateTocOpenedState] = createStore({
    isOpened: false,
})

export function toggleToc() {
    updateTocOpenedState({
        isOpened: !tocOpenedState.isOpened,
    })
}

export function getTocState() {
    return tocOpenedState.isOpened
}

export function handleGlobalClick() {}
