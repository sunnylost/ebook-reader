import { FiLoader } from 'solid-icons/fi'

export function LoadingStatus() {
    return (
        <div class="fixed top-0 left-0 w-full h-full flex backdrop-blur">
            <div class="m-auto flex flex-col items-center text-2xl">
                <div class="mb-4">Loading book...</div>
                <FiLoader class="animate-spin" />
            </div>
        </div>
    )
}
