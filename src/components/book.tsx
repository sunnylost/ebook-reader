import { For, Match, Switch } from 'solid-js'
import { FloatToolbar } from './float-toolbar'
import { BookContentEntry } from '@/types'

// TODO
export function Book(props: { book: BookContentEntry[] }) {
    return (
        <div class="book w-[1000px] m-auto px-10 bg-[#1e1818] text-white">
            <div class="book-content">
                <For each={props.book}>
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
            <FloatToolbar></FloatToolbar>
        </div>
    )
}
