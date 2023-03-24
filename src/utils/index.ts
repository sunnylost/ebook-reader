// @ts-ignore
import SparkMD5 from 'spark-md5'

// https://github.com/satazor/js-spark-md5
export async function generateFileUrl(file: File): Promise<string> {
    let resolveFn: (hash: string) => void
    let chunkSize = 2097152
    let chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    let spark = new SparkMD5.ArrayBuffer()
    let fileReader = new FileReader()
    let blobSlice = File.prototype.slice

    fileReader.onload = function (e) {
        spark.append(e.target?.result)
        currentChunk++

        if (currentChunk < chunks) {
            loadNext()
        } else {
            resolveFn(spark.end())
        }
    }

    fileReader.onerror = function () {
        console.warn('oops, something went wrong.')
    }

    function loadNext() {
        const start = currentChunk * chunkSize,
            end = start + chunkSize >= file.size ? file.size : start + chunkSize

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()

    return new Promise((resolve) => {
        resolveFn = resolve
    })
}
