import type { Book } from '@/types'
import { parse as parseEpub } from './epub'
import { parse as parseMobi } from './mobi'
import { parse as parseTxt } from './txt'

const handler: {
    [k in string]: Function
} = {
    '.epub': parseEpub,
    '.mobi': parseMobi,
    '.txt': parseTxt,
}

export async function parseBook(
    name: string,
    content: File
): Promise<Book> | never {
    const matches = name.match(/\.[^.]+$/)

    if (!matches || !handler[matches[0]]) {
        throw new Error('not supported yet.')
    }

    return await handler[matches[0]](content)
}

export const emptyBook: Book = {
    isLoaded: false,
    title: '',
    author: '',
    toc: {},
    entries: [],
}
