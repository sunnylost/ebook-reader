import { Font } from './tools/font'
import { Toc } from './tools/toc'

export function FloatToolBar() {
    return (
        <div class="fixed top-1/2 right-[calc(50vw_-_570px)] flex flex-col gap-12">
            <Toc></Toc>
            <Font></Font>
        </div>
    )
}
