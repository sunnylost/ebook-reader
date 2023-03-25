export interface BookToc {}

export const BookContentTypes = {
    css: 'css',
    image: 'image',
    html: 'html',
} as const

export type BookContentType = keyof typeof BookContentTypes

export interface BookContentEntry {
    type: BookContentType
    content: string
}

export interface Book {
    isLoaded: boolean
    entries: BookContentEntry[]
}

export interface BookStore {
    bookList: Book[]
    currentBook: Book | null
}
