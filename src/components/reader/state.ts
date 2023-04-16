import { createStore } from 'solid-js/store'

export const [readerState, updateReaderState] = createStore({
    isShowTools: true,
})

export function toggleToolsVisibility() {
    updateReaderState({
        isShowTools: !readerState.isShowTools,
    })
}
