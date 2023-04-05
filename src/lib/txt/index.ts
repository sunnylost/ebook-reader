import { Book, BookContentTypes } from '@/types'
import { readFileContent } from '@/utils'

export async function parse(rawContent: File): Promise<Book> {
    const result = await readFileContent(rawContent, 'text')

    return {
        isLoaded: true,
        entries:
            !result.isOK || !result.content
                ? []
                : result.content
                      .toString()
                      .split('\n')
                      .map((line) => {
                          return {
                              type: BookContentTypes.html,
                              content: `<p>${line}</p>`,
                          }
                      }),
    }
}
