// @ts-ignore
import SparkMD5 from 'spark-md5'
import { globalConfig, updateGlobalConfig } from '@/stores'
import { GlobalConfig, Mode } from '@/types'

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

const GLOBAL_CONFIG_KEY = 'global-config'

const defaultConfig: GlobalConfig = {
    fontSize: 14,
    mode: Mode.system,
    currentColorScheme: getCurrentSystemColorScheme(),
}

export function retrieveGlobalConfig() {
    let savedConfig

    try {
        const savedData = window.localStorage.getItem(GLOBAL_CONFIG_KEY)
        savedConfig = savedData ? JSON.parse(savedData) : {}
        monitorSystemColorSchemeChange()
    } catch {
        savedConfig = {}
    }

    return {
        ...defaultConfig,
        ...savedConfig,
    }
}

export function backupGlobalConfig(config: any) {
    try {
        window.localStorage.setItem(GLOBAL_CONFIG_KEY, JSON.stringify(config))
    } catch {
        window.localStorage.setItem(GLOBAL_CONFIG_KEY, JSON.stringify({}))
    }
}

export function readFileContent(
    f: File,
    type = 'blob'
): Promise<{
    isOK: boolean
    content: string | ArrayBuffer | null
}> {
    return new Promise((resolve) => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
            resolve({
                isOK: true,
                content: fileReader.result,
            })
        }

        fileReader.onerror = (e) => {
            resolve({
                isOK: false,
                content: null,
            })
        }

        if (type === 'text') {
            fileReader.readAsText(f, 'utf-8')
        } else {
            fileReader.readAsArrayBuffer(f)
        }
    })
}

export function monitorSystemColorSchemeChange() {
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', ({ matches }) => {
            if (globalConfig.mode === Mode.system) {
                updateGlobalConfig({
                    currentColorScheme: matches ? Mode.dark : Mode.light,
                })
            }
        })
}

export function getCurrentSystemColorScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? Mode.dark
        : Mode.light
}

export function capitalize(str: string) {
    return `${str[0].toUpperCase()}${str.substring(1)}`
}
