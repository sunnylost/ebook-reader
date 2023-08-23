import { Book } from '@/types'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { readFileContent } from '@/utils'

export async function parse(rawContent: File): Promise<Book> {
    const result = await readFileContent(rawContent)

    const pdf = (await pdfjsLib.getDocument(result.content)
        .promise) as Promise<PDFDocumentProxy>

    return {
        isLoaded: true,
        entries: [],
        pdf,
    }
}
