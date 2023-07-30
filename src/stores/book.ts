import { createStore } from 'solid-js/store'
import { parseBook } from '@/lib/ebook-parser'
import type { Book, BookContentEntry } from '@/types'
import { createEffect, onCleanup, onMount } from 'solid-js'

export const BOOK_STATUS = {
    init: 'init',
    loading: 'loading',
    error: 'error',
    done: 'done',
} as const

type PageInfo = {
    currentChapterPageNumber: number
    currentChapterTotalPageNumber: number
    currentChapterRemainPageNumber: number
}

type ChapterNumber = {
    currentChapterNumber: number
    totalChapterNumber: number
    hasNextChapter: boolean
    hasPrevChapter: boolean
}

type BookStore = {
    status: keyof typeof BOOK_STATUS
    currentOpenedBook: Book | null
    error: string
    chapterNumber: ChapterNumber
    pageNumber: PageInfo
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
    chapterNumber: {
        currentChapterNumber: 1,
        totalChapterNumber: 0,
        get hasNextChapter() {
            return this.currentChapterNumber < this.totalChapterNumber
        },
        get hasPrevChapter() {
            return this.currentChapterNumber > 1
        },
    },
    pageNumber: {
        currentChapterPageNumber: 1,
        currentChapterTotalPageNumber: 0,
        get currentChapterRemainPageNumber() {
            return (
                this.currentChapterTotalPageNumber -
                this.currentChapterPageNumber
            )
        },
    },

    get hasNextPage() {
        return (
            this.chapterNumber.hasNextChapter ||
            (this.currentPageNum < this.totalPageNum && this.totalPageNum !== 1)
        )
    },

    get hasPrevPage() {
        return this.chapterNumber.hasPrevChapter || this.currentPageNum > 0
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
        setTimeout(() => {
            calculateChapterPages()
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
        // updateBookState({
        //     currentPageNum: bookState.currentPageNum + 1,
        // })
        const { chapterNumber } = bookState
        // TODO: 当前章节到头，进入下一章
        if (
            chapterNumber.totalChapterNumber <=
            chapterNumber.currentChapterNumber
        ) {
            updateBookState({
                currentPageNum: bookState.currentPageNum + 1,
                chapterNumber: {
                    ...chapterNumber,
                    currentChapterNumber: 1,
                },
            })
            setTimeout(calculateChapterPages)
        } else {
            updateBookState({
                chapterNumber: {
                    ...chapterNumber,
                    currentChapterNumber:
                        chapterNumber.currentChapterNumber + 2,
                },
            })
        }
    }
}

export function prevPage() {
    if (bookState.hasPrevPage) {
        // updateBookState({
        //     currentPageNum: bookState.currentPageNum - 1,
        // })
        const { chapterNumber } = bookState
        // TODO: 当前章节到头，进入下一章
        if (chapterNumber.currentChapterNumber === 1) {
            updateBookState({
                currentPageNum: bookState.currentPageNum - 1,
                chapterNumber: {
                    ...chapterNumber,
                    currentChapterNumber: 1, // TODO
                },
            })
            setTimeout(calculateChapterPages)
        } else {
            updateBookState({
                chapterNumber: {
                    ...chapterNumber,
                    currentChapterNumber:
                        chapterNumber.currentChapterNumber - 2,
                },
            })
        }
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

function calculateChapterPages() {
    if (!currentContainerDiv) {
        return
    }

    updateBookState({
        chapterNumber: {
            ...bookState.chapterNumber,
            totalChapterNumber: Math.ceil(
                currentContainerDiv.scrollWidth /
                    currentContainerDiv.offsetWidth
            ),
        },
    })
}

let bookContainerObserver: ResizeObserver | null
let currentContainerDiv: HTMLElement
export function initBookContainer(container: HTMLElement) {
    bookContainerObserver = new ResizeObserver(() => {
        console.log('book resize')
        currentContainerDiv = container
        calculateChapterPages()
    })

    bookContainerObserver.observe(container)

    onCleanup(() => {
        if (bookContainerObserver) {
            bookContainerObserver.disconnect()
            bookContainerObserver = null
        }
    })
}

function updatePagePosition(pageNum: number) {
    if (!currentContainerDiv) {
        return
    }
    console.log(
        pageNum,
        currentContainerDiv.offsetWidth * Math.floor((pageNum - 1) / 2)
    )
    currentContainerDiv.scrollTo({
        left: currentContainerDiv.offsetWidth * Math.floor((pageNum - 1) / 2),
        behavior: 'smooth',
    })
}

createEffect(() => {
    updatePagePosition(bookState.chapterNumber.currentChapterNumber)
})

document.body.addEventListener('keyup', (e) => {
    if (bookState.status !== BOOK_STATUS.done) {
        return
    }

    if (e.key === 'ArrowRight') {
        nextPage()
    } else if (e.key === 'ArrowLeft') {
        prevPage()
    }
})
