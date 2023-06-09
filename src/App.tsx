import { Match, Show, Switch } from 'solid-js'
import { Uploader } from '@/components/uploader'
import { Reader } from '@/components/reader'
import { TopBar } from '@/components/top-bar'
import { Alert } from '@/components/alert'
import { openBook, bookState, BOOK_STATUS, resetBookState } from '@/stores/book'
import { DragAndDropContextProvider } from './components/useDragAndDrop'
import { LoadingStatus } from '@/components/loading-status'

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
