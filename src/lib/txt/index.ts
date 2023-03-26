import { BookContentTypes } from '@/types'

export async function parse(rawContent: File) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve({
                isLoaded: true,
                entries: reader.result
                    ? reader.result
                          .toString()
                          .split('\n')
                          .map((line) => {
                              return {
                                  type: BookContentTypes.html,
                                  content: `<p>${line}</p>`,
                              }
                          })
                    : [],
            })
        }
        reader.readAsText(rawContent)
    })
}
