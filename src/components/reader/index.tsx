import { Show } from 'solid-js'
import { Book } from './book'
import { Top } from './top'
import { Nav } from './nav'
import { bookState } from '@/stores/book'

export function Reader() {
    return (
        <div class="relative">
            <Book book={bookState.currentOpenedBook}></Book>
            <div class="absolute top-0 left-0 w-full">
                <Top></Top>
                <Nav></Nav>
            </div>
        </div>
    )
}
