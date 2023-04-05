import { Book, BookContentTypes } from '@/types'
import { readFileContent } from '@/utils'

export async function parse(rawContent: File): Promise<Book> {
    const result = await readFileContent(rawContent, 'text')

    return {
        isLoaded: true,
        entries:
            !result.isOK || !result.content
                ? []
                : [
                      {
                          type: BookContentTypes.html,
                          content: result.content
                              .toString()
                              .split('\n')
                              .map((line) => `<p>${line}</p>`)
                              .join(''),
                      },
                  ],
    }
}
