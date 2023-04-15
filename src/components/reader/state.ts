import { createStore } from 'solid-js/store'

export const [readerState, updateReaderState] = createStore({
    isShowTools: false,
})

export function toggleToolsVisibility() {
    updateReaderState({
        isShowTools: !readerState.isShowTools,
    })
}
