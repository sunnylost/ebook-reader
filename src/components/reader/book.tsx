import { Match, Show, Switch } from 'solid-js'
import { bookState } from '@/stores/book'
import { toggleToolsVisibility } from './state'
import { Book as BookType } from '@/types'

// TODO
export function Book(props: { book: BookType | null }) {
    return (
        <div
            class="book relative w-[80vw] h-[90vh] m-auto px-10 bg-bg text-text dark:bg-dark-bg dark:text-dark-text overflow-auto"
            onClick={() => toggleToolsVisibility()}
        >
            <Show when={bookState.currentPageContent}>
                <div class="book-content">
                    <div class="entry-wrap">
                        <Switch>
                            <Match
                                when={
                                    bookState.currentPageContent?.type === 'css'
                                }
                            >
                                <link
                                    rel="stylesheet"
                                    href={bookState.currentPageContent?.content}
                                ></link>
                            </Match>
                            <Match
                                when={
                                    bookState.currentPageContent?.type ===
                                    'html'
                                }
                            >
                                <div
                                    class="text-left"
                                    innerHTML={
                                        bookState.currentPageContent?.content ||
                                        ''
                                    }
                                ></div>
                            </Match>
                        </Switch>
                    </div>
                </div>
            </Show>
        </div>
    )
}
