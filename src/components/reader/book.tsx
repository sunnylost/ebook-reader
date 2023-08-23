import {
    createEffect,
    createSignal,
    Match,
    onMount,
    Show,
    Switch,
} from 'solid-js'
import { bookState, initBookContainer } from '@/stores/book'

// TODO

let bookContainerRef: HTMLDivElement

export function Book() {
    onMount(() => {
        initBookContainer(bookContainerRef)
    })

    const [page, setPage] = createSignal({
        type: '',
        content: '',
    })
    createEffect(async () => {
        bookState.currentPageNum
        const result = await bookState.getCurrentPageContent()
        setPage(result)
    })

    return (
        <div class="book relative w-[80vw] h-[90vh] m-auto px-10 bg-bg text-text dark:bg-dark-bg dark:text-dark-text overflow-auto">
            <Show when={page().content}>
                <div class="book-content h-full">
                    <div
                        ref={bookContainerRef}
                        class="entry-wrap h-full px-10 columns-2 overflow-hidden"
                    >
                        <Switch>
                            <Match when={page().type === 'css'}>
                                <link
                                    rel="stylesheet"
                                    href={bookState.currentPageContent?.content}
                                ></link>
                            </Match>
                            <Match when={page().type === 'html'}>
                                <div
                                    class="text-left"
                                    innerHTML={page().content || ''}
                                ></div>
                            </Match>
                        </Switch>
                    </div>
                </div>
            </Show>
        </div>
    )
}
