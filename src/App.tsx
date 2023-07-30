import { Match, Show, Switch } from 'solid-js'
import { Alert, LoadingStatus, Reader, TopBar, Uploader } from '@/components'
import { openBook, bookState, BOOK_STATUS, resetBookState } from '@/stores/book'
import { DragAndDropContextProvider } from './hooks/useDragAndDrop'

export default function App() {
    return (
        <DragAndDropContextProvider>
            <TopBar></TopBar>
            <Switch>
                <Match
                    when={
                        bookState.status === BOOK_STATUS.init ||
                        bookState.status === BOOK_STATUS.loading ||
                        bookState.status === BOOK_STATUS.error
                    }
                >
                    <Uploader onChange={(e) => openBook(e)}></Uploader>
                    <Show when={bookState.status === BOOK_STATUS.loading}>
                        <LoadingStatus></LoadingStatus>
                    </Show>
                    <Show when={bookState.status === BOOK_STATUS.error}>
                        <Alert
                            msg={bookState.error}
                            onHide={() => resetBookState()}
                        ></Alert>
                    </Show>
                </Match>

                <Match when={bookState.status === BOOK_STATUS.done}>
                    <Reader></Reader>
                </Match>
            </Switch>
        </DragAndDropContextProvider>
    )
}
