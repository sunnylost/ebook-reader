export interface BookToc {}

export interface BookPage {}

export interface Book {
    title: string
    author: string
    toc: BookToc
    pages: BookPage[]
}

export interface BookStore {
    book: Book
}
