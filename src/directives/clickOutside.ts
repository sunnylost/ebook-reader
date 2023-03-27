import type { Accessor } from 'solid-js'
import { onCleanup } from 'solid-js'

export default function clickOutside(
    el: HTMLDivElement,
    accessor: Accessor<() => () => void>
) {
    const onClick = (e: Event) =>
        !el.contains(e.target as Node) && accessor()?.()
    document.body.addEventListener('click', onClick)

    onCleanup(() => document.body.removeEventListener('click', onClick))
}
