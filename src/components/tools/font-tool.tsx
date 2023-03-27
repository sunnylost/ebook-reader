import { BsFonts } from 'solid-icons/bs'
import { createSignal, Show } from 'solid-js'
import _clickOutside from '@/directives/clickOutside'
import { getGlobalFont, updateGlobalFont } from '@/stores'

export function FontTool() {
    const [isShow, updateIsShow] = createSignal(false)
    const [fontSize, updateFontSize] = createSignal(getGlobalFont())
    // solid's directive needs to do this
    const clickOutside = _clickOutside

    function handleRangeChange(e: Event & { currentTarget: HTMLInputElement }) {
        const fontSize = Number.parseInt(e.currentTarget.value, 10)
        updateFontSize(fontSize)
        updateGlobalFont(fontSize)
    }

    return (
        <div
            class="flex items-start fixed top-1/2 right-[calc(50vw_-_570px)] bg-primary transition-all rounded"
            use:clickOutside={() => updateIsShow(false)}
        >
            <Show when={isShow()}>
                <div class="p-4 flex flex-col items-center">
                    <div class="flex items-center before:content-['A-'] after:content-['A+']">
                        <input
                            class="mx-2"
                            type="range"
                            value={fontSize()}
                            min="10"
                            max="32"
                            step="1"
                            onchange={(e) => handleRangeChange(e)}
                        />
                    </div>
                    <div>{fontSize()}</div>
                </div>
            </Show>
            <BsFonts
                class="text-[24px] cursor-pointer"
                onClick={() => updateIsShow(true)}
            ></BsFonts>
        </div>
    )
}
