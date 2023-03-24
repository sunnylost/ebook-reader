import { createSignal, Show } from 'solid-js'
import { Uploader } from '@/components/uploader'
import { parseBook } from '@/lib'
import { Book as BookComponent } from './components/book'
import { generateFileUrl } from '@/utils'
import { Book } from '@/types'
import { openBook } from '@/stores'
import { DragAndDropContextProvider } from './utils/useDragAndDrop'

const [book, updateBook] = createSignal<Book | null>(null)
async function handleFileChange(e: InputEvent) {
    const target = e.target as HTMLInputElement
    const uploadFile = target.files?.[0] as File
    const bookId = await generateFileUrl(uploadFile)

    let ebook: Book
    console.log(bookId, uploadFile)

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
            <h1>Welcome to Ebook Reader</h1>
            <Show
                when={book()}
                fallback={
                    <div class="w-full h-full flex">
                        <Uploader onChange={handleFileChange}></Uploader>
                    </div>
                }
            >
                <BookComponent book={book()}></BookComponent>
            </Show>
        </DragAndDropContextProvider>
    )
}
