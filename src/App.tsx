import { createSignal, Show } from 'solid-js'
import { Uploader } from '@/components/uploader'
import { parseBook, emptyBook } from '@/lib'
import { Book as BookComponent } from './components/book'
import { generateFileUrl } from '@/utils'
import { openBook } from '@/stores'
import { Book } from '@/types'
import { DragAndDropContextProvider } from './utils/useDragAndDrop'

const [book, updateBook] = createSignal<Book>(emptyBook)
async function handleFileChange(e: InputEvent) {
    const target = e.target as HTMLInputElement
    const uploadFile = target.files?.[0] as File
    const bookId = await generateFileUrl(uploadFile)

    let ebook: Book

    try {
        ebook = await parseBook(uploadFile.name, uploadFile)
    } catch (e) {
        console.log(e)
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
        </DragAndDropContextProvider>
    )
}
