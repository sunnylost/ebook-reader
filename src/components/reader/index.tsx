import { Show } from 'solid-js'
import { Book } from './book'
import { Top } from './top'
import { Nav } from './nav'
import { bookState } from '@/stores/book'
import { readerState } from './state'

export function Reader() {
    return (
        <div class="relative">
            <Book book={bookState.currentOpenedBook}></Book>
            <Show when={readerState.isShowTools}>
                <div class="absolute top-0 left-0">
                    <Top></Top>
                    <Nav></Nav>
                </div>
            </Show>
        </div>
    )
}
