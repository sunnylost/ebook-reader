import {
    createContext,
    onMount,
    onCleanup,
    useContext,
    createSignal,
    JSX,
    Accessor,
} from 'solid-js'

const DragAndDropContext = createContext<[Accessor<File | null>]>([() => null])

export function DragAndDropContextProvider(props: { children?: JSX.Element }) {
    let wrapperRef: HTMLDivElement | undefined
    const [getFile, setFile] = createSignal<File | null>(null)

    function handleDragOver(e: DragEvent) {
        e.preventDefault()
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault()
        const target = e.dataTransfer

        if (target && target.files.length) {
            setFile(() => target.files[0])
        }
    }

    onMount(() => {
        if (!wrapperRef) {
            return
        }

        wrapperRef.addEventListener('dragover', handleDragOver)
        wrapperRef.addEventListener('drop', handleDrop)
    })

    onCleanup(() => {
        if (!wrapperRef) {
            return
        }

        wrapperRef.removeEventListener('dragover', handleDragOver)
        wrapperRef.removeEventListener('drop', handleDrop)
    })

    return (
        <DragAndDropContext.Provider value={[getFile]}>
            <div ref={wrapperRef} class="h-full">
                {props.children}
            </div>
        </DragAndDropContext.Provider>
    )
}

export function useDragAndDrop() {
    return useContext(DragAndDropContext)
}
