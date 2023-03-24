import { createStore } from 'solid-js/store'
import { Book, BookStore } from '@/types'

const [state, setState] = createStore<BookStore>({
    book: null,
})

export function openBook(bookId: string, book: Book) {
    setState('book', book)
}
