import { Match, Show, Switch } from 'solid-js'
import { Uploader } from '@/components/uploader'
import { Book as BookComponent } from '@/components/book'
import { TopBar } from '@/components/top-bar'
import { Alert } from '@/components/alert'
import { openBook, bookState, BOOK_STATUS, resetBookState } from '@/stores/book'
import { DragAndDropContextProvider } from './utils/useDragAndDrop'
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
                    <BookComponent
                        book={bookState.currentOpenedBook}
                    ></BookComponent>
                </Match>
            </Switch>
        </DragAndDropContextProvider>
    )
}
