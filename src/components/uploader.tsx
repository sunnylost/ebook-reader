import { createEffect } from 'solid-js'
import { FaSolidUpload } from 'solid-icons/fa'
import { useDragAndDrop } from '@/utils/useDragAndDrop'

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
        <div class="w-full h-full flex">
            <div ref={dragAreaRef} class="m-auto">
                <h1 class="mb-2">
                    Welcome to Ebook Reader, select a file or drop file here
                </h1>

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
                <a
                    class="block mt-2 text-center underline hover:text-blue-500"
                    href="./pdf-viewer/viewer.html"
                >
                    Or you can open PDF Viewer
                </a>
            </div>
        </div>
    )
}
