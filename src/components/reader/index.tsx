import { Book } from './book'
import { Top } from './top'
import { Nav } from './nav'

export function Reader() {
    return (
        <div class="relative">
            <Book></Book>
            <div class="absolute top-0 left-0 w-full">
                <Top></Top>
                <Nav></Nav>
            </div>
        </div>
    )
}
