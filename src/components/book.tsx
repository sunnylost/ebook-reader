import { For, Match, Switch } from 'solid-js'
import { Image } from './image'

export function Book(props: {
    book: {
        type: string
        content: string
    }[]
}) {
    return (
        <div class="book m-1">
            <For each={props.book}>
                {(item) => (
                    <div class="entry-wrap">
                        <Switch>
                            <Match when={item.type === 'image'}>
                                <Image src={item.content}></Image>
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
