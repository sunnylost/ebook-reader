import { parse as parseEpub } from './epub/index'
import { parse as parseMobi } from './mobi/index'
import type { Book } from './types'

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
