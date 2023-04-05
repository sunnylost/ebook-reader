import { JSXElement } from 'solid-js'

export function Button(props: {
    children: JSXElement
    onClick: () => void
    tooltip?: string
}) {
    return (
        <div
            class="flex justify-center w-1/2 py-4 bg-[#19376D] text-white rounded-lg cursor-pointer hover:bg-[#2C4F8E]"
            onClick={() => props.onClick()}
            title={props.tooltip || ''}
        >
            {props.children}
        </div>
    )
}
