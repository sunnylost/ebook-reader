import {
    createContext,
    onMount,
    onCleanup,
    useContext,
    createSignal,
} from 'solid-js'
import { createStore } from 'solid-js/store'

const DragAndDropContext = createContext([])

export function DragAndDropContextProvider(props) {
    let wrapperRef: HTMLDivElement
    const [getDragEvent, setDragEvent] = createSignal<DragEvent | null>(null)

    onMount(() => {
        console.log(wrapperRef)
        wrapperRef.addEventListener('dragenter', () => {
            console.log('file!')
        })
        wrapperRef.addEventListener('dragover', (e) => {
            e.preventDefault()
        })
        wrapperRef.addEventListener('drop', (e) => {
            e.preventDefault()
            setDragEvent({
                target: e.dataTransfer,
            })
        })
    })

    return (
        <DragAndDropContext.Provider value={[getDragEvent]}>
            <div ref={wrapperRef} class="h-full">
                {props.children}
            </div>
        </DragAndDropContext.Provider>
    )
}

export function useDragAndDrop() {
    return useContext(DragAndDropContext)
}
