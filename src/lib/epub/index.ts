import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import type { Entry } from '@zip.js/zip.js'
import type { Book, BookContentEntry, BookContentType } from '@/types'
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

async function transformContent(
    item: intermediateEntry,
    imageMap: Map<string, string>
) {
    const entry = item.content as Entry
    const xml = await parseXML(entry)
    const links = [...xml.querySelectorAll('link, meta')]
    links.forEach((link) => {
        link.remove()
    })
    const images = [...xml.querySelectorAll('img, image')]

    images.forEach((img) => {
        const attributeName =
            img.tagName.toLowerCase() === 'image' ? 'xlink:href' : 'src'
        const baseURL = new URL(item.href || '', img.baseURI).href
        const src = img.getAttribute(attributeName) as string
        const imageHref = new URL(src, baseURL).pathname
        const matchImage = imageMap.get(imageHref)

        if (matchImage) {
            img.setAttribute(attributeName, matchImage as string)
        }
    })

    return new XMLSerializer().serializeToString(xml.documentElement) as string
}

type intermediateEntry = {
    type: BookContentType
    href: string | null
    content: string | Entry
}

// TODO
function transformPathToAbsolute(path: string) {
    const baseURL = new URL(path, location.href).href
    return new URL(path, baseURL).pathname
}

async function parseRootFile(entry: Entry) {
    const xml = await parseXML(entry)
    console.log('root file:', xml)
    const spine = xml.querySelector('spine')?.children || []
    const children = xml.querySelector('manifest')?.children || []
    const manifestEntryMap = new Map<string, intermediateEntry>()
    const imageMap = new Map<string, string>()
    for (let item of children) {
        if (isCss(item)) {
            const content = await loadResource(item)
            manifestEntryMap.set(item.id, {
                type: BookContentTypes.css,
                href: item.getAttribute('href'),
                content,
            })
        } else if (isImage(item)) {
            const content = await loadResource(item)
            imageMap.set(
                transformPathToAbsolute(item.getAttribute('href') as string),
                content
            )
        } else {
            const entry = getEntryByNameSuffix(item.getAttribute('href') || '')

            if (entry) {
                manifestEntryMap.set(item.id, {
                    type: BookContentTypes.html,
                    href: item.getAttribute('href'),
                    content: entry,
                })
            }
        }
    }

    let result: BookContentEntry[] = []
    for (let item of spine) {
        const idref = item.getAttribute('idref')

        if (!idref) {
            continue
        }

        const _item = manifestEntryMap.get(idref)

        if (!_item) {
            continue
        }

        if (_item.type === 'html') {
            result.push({
                type: _item.type,
                content: await transformContent(_item, imageMap),
            })
        } else {
            result.push({
                type: _item.type,
                content: _item.content as string,
            })
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
