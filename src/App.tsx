import { createSignal, Show } from 'solid-js'
import { Uploader } from '@/components/uploader'
import { parseBook, emptyBook } from '@/lib'
import { Book as BookComponent } from './components/book'
import { Alert } from '@/components/alert'
import { generateFileUrl } from '@/utils'
import { openBook } from '@/stores'
import { Book } from '@/types'
import { DragAndDropContextProvider } from './utils/useDragAndDrop'

const [book, updateBook] = createSignal<Book>(emptyBook)
const [hasError, updateHasError] = createSignal(false)
const [errorMsg, updateErrorMsg] = createSignal('')
async function handleFileChange(e: InputEvent) {
    const target = e.target as HTMLInputElement
    const uploadFile = target.files?.[0] as File
    const bookId = await generateFileUrl(uploadFile)

    let ebook: Book

    try {
        ebook = await parseBook(uploadFile.name, uploadFile)
    } catch (e: Error) {
        updateHasError(true)
        updateErrorMsg(e.message)
        return
    }

    console.log('Ebook', ebook)
    openBook(bookId, ebook)
    updateBook(ebook)
}

export default function App() {
    return (
        <DragAndDropContextProvider>
            <Show
                when={book()?.isLoaded}
                fallback={<Uploader onChange={handleFileChange}></Uploader>}
                keyed
            >
                <BookComponent book={book()?.entries}></BookComponent>
            </Show>
            {hasError() && (
                <Alert
                    msg={errorMsg()}
                    onHide={() => updateHasError(false)}
                ></Alert>
            )}
        </DragAndDropContextProvider>
    )
}
