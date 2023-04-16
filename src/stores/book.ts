import { createStore } from 'solid-js/store'
import { parseBook } from '@/lib'
import type { Book, BookContentEntry } from '@/types'

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
    totalPageNum: number
    currentPageNum: number
    hasNextPage: boolean
    hasPrevPage: boolean
    currentPageContent: BookContentEntry | null
}

export const [bookState, updateBookState] = createStore<BookStore>({
    status: BOOK_STATUS.init,
    currentOpenedBook: null,
    error: '',
    totalPageNum: 0,
    currentPageNum: 0,

    get hasNextPage() {
        return (
            this.currentPageNum < this.totalPageNum && this.totalPageNum !== 1
        )
    },

    get hasPrevPage() {
        return this.currentPageNum > 0
    },

    get currentPageContent() {
        return this.currentOpenedBook?.entries[this.currentPageNum]
    },
})

export async function openBook(file: File) {
    try {
        updateBookState({
            status: BOOK_STATUS.loading,
        })
        // const bookId = await generateFileUrl(uploadFile)

        const book = await parseBook(file.name, file)
        updateBookState({
            status: BOOK_STATUS.done,
            currentPageNum: 0,
            totalPageNum: book.entries.length,
            currentOpenedBook: book,
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

export function nextPage() {
    if (bookState.hasNextPage) {
        updateBookState({
            currentPageNum: bookState.currentPageNum + 1,
        })
    }
}

export function prevPage() {
    if (bookState.hasPrevPage) {
        updateBookState({
            currentPageNum: bookState.currentPageNum - 1,
        })
    }
}

export function jumpToPage(num: number) {
    if (num === bookState.currentPageNum) {
        return
    }

    if (num >= 0 && num < bookState.totalPageNum) {
        return updateBookState({
            currentPageNum: num,
        })
    }
}
