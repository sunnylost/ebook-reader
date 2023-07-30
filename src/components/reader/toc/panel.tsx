import { createEffect, createSignal, Show } from 'solid-js'
import { getTocState } from '@/stores'
import { bookState, jumpToPage } from '@/stores/book'
import { Portal } from 'solid-js/web'

export function TocPanel() {
    const [isVisible, updateVisible] = createSignal(false)

    createEffect(() => {
        updateVisible(getTocState())
    })

    async function handleClick(e: Event) {
        e.stopPropagation()
        e.preventDefault()

        if (
            e.target &&
            (e.target as HTMLAnchorElement).tagName.toLowerCase() === 'a'
        ) {
            const href =
                (e.target as HTMLAnchorElement).getAttribute('href') || ''
            const pageNum = Number.parseInt(
                (e.target as HTMLAnchorElement).dataset?.index || '',
                10
            )
            const url = new URL(href, location.href)

            if (!Number.isNaN(pageNum)) {
                await jumpToPage(pageNum)
            }

            if (url.hash) {
                const matchedElement = document.querySelector(
                    `.book-content ${url.hash}`
                )

                if (matchedElement) {
                    matchedElement.scrollIntoView({
                        behavior: 'smooth',
                    })
                    updateVisible(false)
                }
            }
        }
    }

    return (
        <Portal>
            <Show when={isVisible()}>
                <div
                    class="fixed left-[15vw] top-0 px-36 py-12 w-fit h-[60vh] bg-bg rounded shadow overflow-auto"
                    onClick={handleClick}
                    innerHTML={bookState.currentOpenedBook?.toc}
                ></div>
            </Show>
        </Portal>
    )
}
