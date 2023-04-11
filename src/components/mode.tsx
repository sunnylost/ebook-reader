import { Component, createSignal, For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { BsPcDisplayHorizontal, BsMoon, BsSun } from 'solid-icons/bs'
import { globalConfig, updateGlobalConfig } from '@/stores'
import { Mode as ModeList, ModeType } from '@/types'
import { capitalize, getCurrentSystemColorScheme } from '@/utils'
import _clickOutside from '@/directives/clickOutside'

const iconMap: Record<ModeType, Component> = {
    [ModeList.dark]: BsMoon,
    [ModeList.light]: BsSun,
    [ModeList.system]: BsPcDisplayHorizontal,
}

export function Mode() {
    const clickOutside = _clickOutside

    const [isShow, updateShowState] = createSignal(false)

    changeColorScheme(globalConfig.mode)

    function handleClick(value?: boolean) {
        if (typeof value !== 'undefined') {
            updateShowState(value)
        } else {
            updateShowState(!isShow())
        }
    }

    function changeColorScheme(item: ModeType) {
        document.body.classList.remove(ModeList.light, ModeList.dark)

        let currentColorScheme

        if (item === ModeList.system) {
            currentColorScheme = getCurrentSystemColorScheme()
        } else {
            currentColorScheme = item
        }

        document.body.classList.add(currentColorScheme)

        updateGlobalConfig({
            mode: item,
            currentColorScheme,
        })
        handleClick(false)
    }

    return (
        <div class="relative mr-10" use:clickOutside={() => handleClick(false)}>
            <div class="p-4 cursor-pointer" onclick={() => handleClick()}>
                <Dynamic
                    class=" w-18 h-18"
                    component={iconMap[globalConfig.mode]}
                ></Dynamic>
            </div>
            <Show when={isShow()}>
                <ul class="absolute top-24 right-0 bg-dark-bg text-dark-text dark:bg-bg dark:text-text rounded">
                    <For each={Object.values(ModeList)}>
                        {(item, key) => (
                            <li
                                class={[
                                    'px-8 py-4 flex items-center gap-4 cursor-pointer hover:bg-bg hover:text-text hover:dark:bg-dark-bg hover:dark:text-dark-text',
                                    item === globalConfig.mode
                                        ? 'text-sky-500'
                                        : '',
                                ].join(' ')}
                                data-mode={item}
                                onClick={() => changeColorScheme(item)}
                            >
                                <Dynamic component={iconMap[item]}></Dynamic>
                                {capitalize(item)}
                            </li>
                        )}
                    </For>
                </ul>
            </Show>
        </div>
    )
}
