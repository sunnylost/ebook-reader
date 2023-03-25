import { For, Match, Switch } from 'solid-js'
import { Image } from './image'

export function Book(props: {
    book: {
        type: string
        content: string
    }[]
}) {
    return (
        <div class="book px-10">
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
                                <div innerHTML={item.content}></div>
                            </Match>
                        </Switch>
                    </div>
                )}
            </For>
        </div>
    )
}
