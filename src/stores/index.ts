import { createStore } from 'solid-js/store'
import { backupGlobalConfig, retrieveGlobalConfig } from '@/utils'

type GlobalConfig = {
    fontSize: number
}
const [globalConfig, setGlobalConfig] = createStore<GlobalConfig>(
    retrieveGlobalConfig()
)
const styleElement = document.createElement('style')
document.body.appendChild(styleElement)

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
    setGlobalConfig({
        ...globalConfig,
        fontSize: font,
    })

    setTimeout(() => {
        generateStyle(globalConfig)
        backupGlobalConfig(globalConfig)
    }, 10)
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
