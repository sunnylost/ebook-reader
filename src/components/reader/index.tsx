import { Book } from './book'
import { Top } from './top'
import { Nav } from './nav'

export function Reader() {
    return (
        <div class="relative mt-20">
            <Book></Book>
            <div class="absolute top-0 left-0">
                <Top></Top>
                <Nav></Nav>
            </div>
        </div>
    )
}
