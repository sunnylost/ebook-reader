import { Match, Show, Switch } from 'solid-js'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'solid-icons/ai'
import { bookState, nextPage, prevPage } from '@/stores/book'
import { FloatToolBar } from './float-toolbar/index'
import { Toc } from './toc'
import { Book as BookType } from '@/types'
import { Button } from '@/components/button'

// TODO
export function Book(props: { book: BookType | null }) {
    return (
        <div class="book relative w-[1000px] m-auto px-10 bg-[#1e1818] text-white">
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
                    <div class="flex justify-center items-center gap-16 py-16">
                        <Show when={bookState.hasPrevPage}>
                            <Button
                                onClick={() => prevPage()}
                                tooltip="Prev Page"
                            >
                                <AiOutlineArrowLeft />
                            </Button>
                        </Show>

                        <Show when={bookState.hasNextPage}>
                            <Button
                                onClick={() => nextPage()}
                                tooltip="Next Page"
                            >
                                <AiOutlineArrowRight />
                            </Button>
                        </Show>
                    </div>
                </div>
                <Toc content={props.book?.toc}></Toc>
                <FloatToolBar></FloatToolBar>
            </Show>
        </div>
    )
}
