import type { Book } from '@/types'
import { parse as parseEpub } from './epub'
import { parse as parseMobi } from './mobi'
import { parse as parsePdf } from './pdf'

export async function parseBook(
    name: string,
    content: File
): Promise<Book> | never {
    if (name.endsWith('.epub')) {
        return await parseEpub(content)
    }

    if (name.endsWith('.mobi')) {
        return await parseMobi(content)
    }

    throw Error('not supported yet.')
}

export const emptyBook: Book = {
    isLoaded: false,
    title: '',
    author: '',
    toc: {},
    entries: [],
}
