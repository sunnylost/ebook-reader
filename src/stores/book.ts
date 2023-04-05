import { createStore } from 'solid-js/store'
import { parseBook } from '@/lib'
import type { Book } from '@/types'

export const BOOK_STATUS = {
    init: 'init',
    loading: 'loading',
    error: 'error',
    done: 'done',
} as const

type BookStore = {
    status: keyof typeof BOOK_STATUS
    currentOpenedBook: Book | null
    error: string
}

export const [bookState, updateBookState] = createStore<BookStore>({
    status: BOOK_STATUS.init,
    currentOpenedBook: null,
    error: '',
})

export async function openBook(event: Event) {
    try {
        const target = event.target as HTMLInputElement
        const uploadFile = target.files?.[0] as File

        updateBookState({
            status: BOOK_STATUS.loading,
        })
        // const bookId = await generateFileUrl(uploadFile)

        updateBookState({
            status: BOOK_STATUS.done,
            currentOpenedBook: await parseBook(uploadFile.name, uploadFile),
        })
    } catch (e) {
        console.log(e)
        if (e instanceof Error) {
            updateBookState({
                status: BOOK_STATUS.error,
                error:
                    e.message ||
                    'Unknown error, please see console for more detail info.',
            })
        }
    }
}

export function resetBookState() {
    updateBookState({
        status: BOOK_STATUS.init,
        error: '',
    })
}
