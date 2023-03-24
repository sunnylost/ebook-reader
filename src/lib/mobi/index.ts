import type { Book } from '../types'

const decoder = new TextDecoder('utf-8')
let offset = 0
let dataView: DataView
let records: {
    offset: number
    attr: number
}[] = []

function jumpTo(_offset: number) {
    offset = _offset
}

function readString(length: number) {
    return decoder.decode(dataView.buffer.slice(offset, (offset += length)))
}

function readBytes(num: number) {
    let result
    if (num === 1) {
        result = dataView.getUint8(offset)
    } else if (num === 2) {
        result = dataView.getUint16(offset)
    } else if (num === 4) {
        result = dataView.getUint32(offset)
    } else if (num === 8) {
        result = dataView.getBigUint64(offset)
    }

    offset += num
    return result
}

function skip(num: number) {
    offset += num
}

function parseMobiFile() {
    console.log('name:', readString(32))
    console.log('attributes:', readBytes(2))
    console.log('version:', readBytes(2))
    console.log('creation date:', readBytes(4))
    console.log('modification date:', readBytes(4))
    console.log('last backup date:', readBytes(4))
    console.log('modification Number:', readBytes(4))
    console.log('appinfo ID:', readBytes(4))
    console.log('sortInfo ID:', readBytes(4))
    console.log('type:', readString(4))
    console.log('creator:', readString(4))
    console.log('unique IDseed:', readBytes(4))
    console.log('next record list ID:', readBytes(4))
    const numberOfRecords = readBytes(2) as number
    console.log('number of records:', numberOfRecords)

    console.log('---------RECORD--------')
    let currentRecordIndex = 0
    while (currentRecordIndex <= numberOfRecords) {
        // console.log(`RECORD ${currentRecordIndex}`)
        records.push({
            offset: readBytes(4) as number,
            attr: readBytes(4) as number,
        })
        // console.log('record data offset:', readBytes(4))
        // console.log('record attributes:', readBytes(4)) // TODO: 1 attr, 3 unique id
        // console.log('unique ID:', readBytes(3))
        currentRecordIndex++
    }
    console.log(records)
    jumpTo(records[0].offset)

    // palm doc header
    console.log('PalmDoc Header')
    console.log('compression:', readBytes(2))
    console.log('unused:', readBytes(2))
    console.log('text length:', readBytes(4))
    console.log('record count:', readBytes(2))
    console.log('record size:', readBytes(2))
    console.log('current position:', readBytes(4))
    // console.log('encryption', readBytes(2))
    // console.log('unknown', readBytes(2))

    const startOffset = offset
    console.log('MOBI Header')
    console.log('Identifier:', readString(4))
    console.log('Header length:', readBytes(4))
    console.log('mobi type:', readBytes(4))
    console.log('text encoding:', readBytes(4))
    console.log('unique id:', readBytes(4))
    console.log('file version:', readBytes(4))
    console.log('ortographic index:', readBytes(4))
    console.log('inflection index:', readBytes(4))
    console.log('index names:', readBytes(4))
    console.log('index keys:', readBytes(4))
    console.log('extra index0:', readBytes(4))
    console.log('extra index1:', readBytes(4))
    console.log('extra index2:', readBytes(4))
    console.log('extra index3:', readBytes(4))
    console.log('extra index4:', readBytes(4))
    console.log('extra index5:', readBytes(4))
    console.log('first none-book index:', readBytes(4))
    console.log('full name offset:', readBytes(4))
    console.log('full name length:', readBytes(4))
    console.log('locale:', readBytes(4))
    console.log('input language:', readBytes(4))
    console.log('output language:', readBytes(4))
    console.log('mini version:', readBytes(4))
    console.log('first image index:', readBytes(4))
    console.log('huffman record offset:', readBytes(4))
    console.log('huffman record count:', readBytes(4))
    console.log('huffman table offset:', readBytes(4))
    console.log('huffman table length:', readBytes(4))

    const hasExthHeader = readBytes(4) === 6
    console.log('EXTH flags:', hasExthHeader)

    console.log('unknown:')
    skip(32)
    console.log('unknown:', readBytes(4))
    console.log('DRM offset:', readBytes(4))
    console.log('DRM count:', readBytes(4))
    console.log('DRM size:', readBytes(4))
    console.log('DRM flags:', readBytes(4))
    skip(8)
    console.log('first content record number:', readBytes(2))
    console.log('last content record number:', readBytes(2))
    skip(4)
    console.log('FLIS record number:', readBytes(4))
    console.log('unknown FLIS record count?:', readBytes(4))
    skip(8)
    skip(4)
    console.log('first compilation data section count:', readBytes(4))
    console.log('number of compilation data sections:', readBytes(4))
    console.log('unknown:', readBytes(4))
    console.log('extra record data flags:', readBytes(4))
    console.log('INDX record offset:', readBytes(4))
    skip(24)

    if (hasExthHeader) {
    }
}
export function handleMobi(file: File): Book {
    const reader = new FileReader()
    reader.onload = (e) => {
        const data = e.target.result

        if (!data) {
            console.log('empty')
            return
        }

        dataView = new DataView(data as ArrayBuffer)
        parseMobiFile()
    }
    reader.readAsArrayBuffer(file)
}
export async function parse(rawContent: ArrayBuffer): Promise<Book> {}
