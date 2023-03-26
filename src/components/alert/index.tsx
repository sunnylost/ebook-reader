import { createSignal, createEffect } from 'solid-js'
import { Portal } from 'solid-js/web'
import { BiSolidErrorCircle } from 'solid-icons/bi'
import './index.css'

export function Alert(props: { msg: string; onHide: () => void }) {
    const [isVisible, setIsVisible] = createSignal(true)

    createEffect(() => {
        if (isVisible()) {
            setTimeout(() => {
                setIsVisible(false)
                props.onHide?.()
            }, 3000)
        }
    })

    return (
        <Portal mount={document.body}>
            <div class="flex absolute top-0 left-0 w-full items-center overflow-hidden">
                <div class="flex my-2 p-4 items-center flex-row m-auto text-red-500 border bg-white rounded shadow animate-[slide-in-and-out_1.5s_ease-in] -translate-y-full opacity-0">
                    <BiSolidErrorCircle></BiSolidErrorCircle>
                    <div class="ml-2 text-neutral-700">{props.msg}</div>
                </div>
            </div>
        </Portal>
    )
}
