import { JSXElement } from 'solid-js'

export function Button(props: {
    children: JSXElement
    onClick: () => void
    class?: string
    tooltip?: string
}) {
    return (
        <div
            class={[
                'flex justify-center py-4 bg-[#19376D] text-white rounded-lg cursor-pointer hover:bg-[#2C4F8E]',
                props?.class,
            ].join(' ')}
            onClick={() => props.onClick()}
            title={props.tooltip || ''}
        >
            {props.children}
        </div>
    )
}
