import { Show } from 'solid-js'
import { bookState, nextPage, prevPage } from '@/stores/book'
import { Button } from '@/components/button'
import { RiSystemArrowLeftSLine, RiSystemArrowRightSLine } from 'solid-icons/ri'

export function Nav() {
    return (
        <>
            <Show when={bookState.hasPrevPage}>
                <Button
                    class="fixed left-10 top-[calc(50vh_-_25px)] w-[50px] h-[100px] flex items-center text-3xl"
                    onClick={() => prevPage()}
                    tooltip="Prev Page"
                >
                    <RiSystemArrowLeftSLine />
                </Button>
            </Show>

            <Show when={bookState.hasNextPage}>
                <Button
                    class="fixed right-10 top-[calc(50vh_-_25px)] w-[50px] h-[100px] flex items-center text-3xl"
                    onClick={() => nextPage()}
                    tooltip="Next Page"
                >
                    <RiSystemArrowRightSLine />
                </Button>
            </Show>
        </>
    )
}
