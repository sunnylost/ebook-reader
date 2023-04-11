export interface BookToc {}

export const BookContentTypes = {
    css: 'css',
    image: 'image',
    html: 'html',
} as const

export type BookContentType = keyof typeof BookContentTypes
export type BookResourceMap = Record<string, any>

export interface BookContentEntry {
    type: BookContentType
    content: string
}

export interface BookPageItem {
    no: number
    content: string
}

export interface Book {
    isLoaded: boolean
    title?: string
    author?: string
    toc?: any
    pages: BookPageItem[]
    resources: BookResourceMap
    entries: BookContentEntry[]
}

export interface BookStore {
    bookList: Book[]
    currentBook: Book | null
}

export const Mode = {
    light: 'light',
    dark: 'dark',
    system: 'system',
} as const

export type ModeType = keyof typeof Mode
export type ColorScheme = keyof Omit<typeof Mode, 'system'>

export type GlobalConfig = {
    fontSize: number
    mode: ModeType
    currentColorScheme: ColorScheme
}
