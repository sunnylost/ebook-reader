import { For, Match, Switch } from 'solid-js'
import { FloatToolBar } from './float-toolbar/index'
import { Toc } from './toc'
import { Book as BookType } from '@/types'

// TODO
export function Book(props: { book: BookType | null }) {
    return (
        <div class="book relative w-[1000px] m-auto px-10 bg-[#1e1818] text-white">
            <div class="book-content">
                <For each={props.book?.entries}>
                    {(item) => (
                        <div class="entry-wrap">
                            <Switch>
                                <Match when={item.type === 'css'}>
                                    <link
                                        rel="stylesheet"
                                        href={item.content}
                                    ></link>
                                </Match>
                                <Match when={item.type === 'html'}>
                                    <div
                                        class="text-left"
                                        innerHTML={item.content}
                                    ></div>
                                </Match>
                            </Switch>
                        </div>
                    )}
                </For>
            </div>
            <Toc content={props.book?.toc}></Toc>
            <FloatToolBar></FloatToolBar>
        </div>
    )
}
