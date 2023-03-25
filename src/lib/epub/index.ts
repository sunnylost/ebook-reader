import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import type { Entry } from '@zip.js/zip.js'
import type { Book } from '@/types'
import { BookContentTypes } from '@/types'

const globalDOMParser = new DOMParser()
let rootDir
let bookEntryMap: Map<string, Entry>

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

function isCss(item: Element) {
    return (item.getAttribute('media-type') || '').startsWith('text/css')
}

async function loadResource(item: Element, attr = 'href') {
    const address = item.getAttribute(attr)

    if (!address) {
        return ''
    }

    const imageEntry = getEntryByNameSuffix(address)

    if (imageEntry) {
        const result = await imageEntry.getData(new BlobWriter(''))
        return URL.createObjectURL(result)
    }

    return ''
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

async function transformContent(entry: Entry, imageMap: Map<string, string>) {
    const xml = await parseXML(entry)
    const links = [...xml.querySelectorAll('link, meta')]
    links.forEach((link) => {
        link.remove()
    })
    const images = [...xml.querySelectorAll('img')]

    images.forEach((img) => {
        const src = img.getAttribute('src') as string

        if (imageMap.has(src)) {
            img.setAttribute('src', imageMap.get(src) as string)
        }
    })

    return new XMLSerializer().serializeToString(xml.documentElement)
}

async function parseRootFile(entry: Entry) {
    const xml = await parseXML(entry)
    console.log('root file:', xml)
    const children = xml.querySelector('manifest')?.children || []
    const temp = []
    const imageMap = new Map<string, string>()
    for (let item of children) {
        if (isCss(item)) {
            const content = await loadResource(item)
            temp.push({
                type: BookContentTypes.css,
                content,
            })
        } else if (isImage(item)) {
            const content = await loadResource(item)
            imageMap.set(item.getAttribute('href') as string, content)
        } else {
            const entry = getEntryByNameSuffix(item.getAttribute('href') || '')

            if (entry) {
                temp.push({
                    type: BookContentTypes.html,
                    content: entry,
                })
            }
        }
    }

    let result = []
    for (let item of temp) {
        if (item.type === 'html') {
            result.push({
                ...item,
                content: await transformContent(
                    item.content as Entry,
                    imageMap
                ),
            })
        } else {
            result.push(item)
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

    return {
        isLoaded: true,
        entries: result,
    }
}
