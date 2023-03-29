import { VsThreeBars } from 'solid-icons/vs'
import { toggleToc } from '@/stores'

export function Toc() {
    return (
        <div
            class="bg-primary transition-all rounded"
            onClick={() => toggleToc()}
        >
            <VsThreeBars class="text-[24px] cursor-pointer"></VsThreeBars>
        </div>
    )
}
