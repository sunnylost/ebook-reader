declare module 'ebook-parser' {
  export function parseBook(): Promise<Book> | never
}
