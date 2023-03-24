import { createEffect } from 'solid-js'
import { FaSolidUpload } from 'solid-icons/fa'
import { useDragAndDrop } from '../utils/useDragAndDrop'

const uploaderID = 'upload-input'
let dragAreaRef: HTMLDivElement
function triggerUploadAction() {
    document.getElementById(uploaderID)?.click()
}

export function Uploader(prop) {
    const [getDragEvent] = useDragAndDrop()

    createEffect(() => {
        let e = getDragEvent()

        if (!e) {
            return
        }

        prop.onChange(e)
    })

    return (
        <div ref={dragAreaRef}>
            <input
                id={uploaderID}
                type="file"
                class="hidden"
                onChange={(e) => prop.onChange(e)}
            />
            <FaSolidUpload
                class="text-2xl m-auto cursor-pointer"
                onClick={triggerUploadAction}
            ></FaSolidUpload>
        </div>
    )
}
