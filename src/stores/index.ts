import { createStore } from 'solid-js/store'
import { Book, BookStore } from '@/types'
import { backupGlobalConfig, retrieveGlobalConfig } from '@/utils'

const [globalConfig, setGlobalConfig] = createStore(retrieveGlobalConfig())

export function getGlobalFont() {
    return globalConfig.fontSize
}

export function updateGlobalFont(font: number) {
    setGlobalConfig({
        ...globalConfig,
        fontSize: font,
    })

    backupGlobalConfig(globalConfig)
}

// TODO
const [state, setState] = createStore<BookStore>({
    book: null,
})

export function openBook(bookId: string, book: Book) {
    setState('book', book)
}
