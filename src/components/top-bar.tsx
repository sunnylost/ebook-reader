import { Mode } from './mode'
import { Font } from './reader/tools/font'

export function TopBar() {
    return (
        <div class="absolute top-0 w-full flex items-center justify-end z-10">
            <Font></Font>
            <Mode></Mode>
        </div>
    )
}
