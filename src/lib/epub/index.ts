import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import type { Entry } from '@zip.js/zip.js'
import type { Book } from '../types'

const globalDOMParser = new DOMParser()
let rootDir
let bookEntryMap: Map<string, Entry>
const imageUrls = []

function getEntryByNameSuffix(name: string) {
    for (let [_, entry] of bookEntryMap) {
        if (entry.filename.endsWith(name)) {
            return entry
        }
    }
}

function isImage(item: Element) {
    return (item.getAttribute('media-type') || '').startsWith('image')
}

async function loadImage(item: Element) {
    const imageEntry = getEntryByNameSuffix(item.getAttribute('href') || '')

    if (imageEntry) {
        const result = await imageEntry.getData(new BlobWriter(''))
        return URL.createObjectURL(result)
    }
}

async function getEntryContent(entry: Entry) {
    const data = await entry.getData(new BlobWriter(''))
    return data.text()
}

async function parseXML(entry: Entry) {
    const text = await getEntryContent(entry)
    return globalDOMParser.parseFromString(text, 'text/xml')
}
function generateTOC() {}

async function parseRootFilePath(): Promise<string> {
    const containerXML = bookEntryMap.get('META-INF/container.xml')

    if (!containerXML) {
        console.log('no container.xml')
        return ''
    }

    const xml = await parseXML(containerXML)
    const rootFileTag = xml.querySelector('container rootfiles rootfile')
    return rootFileTag?.getAttribute('full-path') || ''
}

async function parseRootFile(entry: Entry) {
    const xml = await parseXML(entry)
    console.log('root file:', xml)
    const children = xml.querySelector('manifest')?.children || []
    const result = []
    for (let item of children) {
        if (isImage(item)) {
            const content = await loadImage(item)
            debugger
            result.push({
                type: 'image',
                content,
            })
        } else {
            const entry = getEntryByNameSuffix(item.getAttribute('href') || '')

            if (entry) {
                const content = await getEntryContent(entry)
                const xml = await parseXML(entry)
                console.log(xml)
                result.push({ type: 'html', content })
            }
        }
    }

    return result
}

export async function parse(rawContent: File): Promise<Book> {
    const reader = new ZipReader(new BlobReader(rawContent))
    const entries = await reader.getEntries()
    bookEntryMap = new Map()
    entries.forEach((entry) => {
        bookEntryMap.set(entry.filename, entry)
    })
    const rootFilePath = await parseRootFilePath()
    rootDir = rootFilePath.split('/')[0] // TODO
    const rootFileEntry = bookEntryMap.get(rootFilePath)

    if (!rootFileEntry) {
        throw Error('invalid format, cannot find container.xml')
    }

    const result = await parseRootFile(rootFileEntry)
    await reader.close()

    return result
}
