/**
 * https://wiki.mobileread.com/wiki/PDB
 * https://wiki.mobileread.com/wiki/MOBI
 */

import type { Book } from '@/types'
import { PDBHeader, PalmHeader, MobiHeader } from './types'

class MobiFile {
    pdbHeader: PDBHeader
    palmHeader: PalmHeader
    header: MobiHeader
    records: {
        offset: number
        attr: number
    }[] = []

    constructor() {
        this.pdbHeader = {} as PDBHeader
        this.palmHeader = {} as PalmHeader
        this.header = {} as MobiHeader
    }
}

let mobi: MobiFile
const decoder = new TextDecoder('utf-8')
let offset = 0
let dataView: DataView
let fileTitle: string

function jumpTo(_offset: number) {
    offset = _offset
}

function readString(length: number) {
    return decoder.decode(dataView.buffer.slice(offset, (offset += length)))
}

function peakString(length: number) {
    return decoder.decode(dataView.buffer.slice(offset, offset + length))
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

    skip(num)
    return result as number
}

function skip(num: number) {
    offset += num
}

function parsePDBHeader() {
    const { pdbHeader } = mobi
    pdbHeader.name = readString(32)
    pdbHeader.attributes = readBytes(2)
    pdbHeader.version = readBytes(2)
    pdbHeader.createTime = readBytes(4)
    pdbHeader.modificationTime = readBytes(4)
    pdbHeader.lastBackupTime = readBytes(4)
    pdbHeader.modificationNumber = readBytes(4)
    pdbHeader.appInfoId = readBytes(4)
    pdbHeader.sortInfoId = readBytes(4)
    pdbHeader.type = readString(4)
    pdbHeader.creator = readString(4)
    pdbHeader.uniqueIDSeed = readBytes(4)
    pdbHeader.nextRecordListId = readBytes(4)
    pdbHeader.numberOfRecords = readBytes(2)
}

function parseMobiRecords() {
    let currentRecordIndex = 0
    while (currentRecordIndex < mobi.pdbHeader.numberOfRecords) {
        mobi.records.push({
            offset: readBytes(4),
            attr: readBytes(4),
        })
        currentRecordIndex++
    }
}

function parsePalDocHeader() {
    const { palmHeader } = mobi
    palmHeader.compression = readBytes(2)
    palmHeader.unused = readBytes(2)
    palmHeader.textLength = readBytes(4)
    palmHeader.recordCount = readBytes(2)
    palmHeader.recordSize = readBytes(2)
    palmHeader.currentPosition = readBytes(4)
}

function parseMobiHeader() {
    const { header } = mobi
    const _offset = offset
    header.identifier = readString(4)
    header.headerLength = readBytes(4)
    header.mobiType = readBytes(4)
    header.textEncoding = readBytes(4)
    header.uniqueID = readBytes(4)
    header.fileVersion = readBytes(4)
    header.ortographicIndex = readBytes(4)
    header.inflectionIndex = readBytes(4)
    header.indexNames = readBytes(4)
    header.indexKeys = readBytes(4)
    header.extraIndex0 = readBytes(4)
    header.extraIndex1 = readBytes(4)
    header.extraIndex2 = readBytes(4)
    header.extraIndex3 = readBytes(4)
    header.extraIndex4 = readBytes(4)
    header.extraIndex5 = readBytes(4)
    header.firstNoneBookIndex = readBytes(4)
    header.fullNameOffset = readBytes(4)
    header.fullNameLength = readBytes(4)
    header.locale = readBytes(4)
    header.inputLanguage = readBytes(4)
    header.outputLanguage = readBytes(4)
    header.miniVersion = readBytes(4)
    header.firstImageIndex = readBytes(4)
    header.huffmanRecordOffset = readBytes(4)
    header.huffmanRecordCount = readBytes(4)
    header.huffmanTableOffset = readBytes(4)
    header.huffmanTableLength = readBytes(4)
    header.exthFlags = readBytes(4)

    skip(32)
    skip(4)
    header.drmOffset = readBytes(4)
    header.drmCount = readBytes(4)
    header.drmSize = readBytes(4)
    header.drmFlags = readBytes(4)
    skip(8)
    header.firstContentRecordNumber = readBytes(2)
    header.lastContentRecordNumber = readBytes(2)
    skip(4)
    header.flisRecordNumber = readBytes(4)
    header.unknownFlisRecordCount = readBytes(4)
    skip(8)
    skip(4)
    header.firstCompilationDataSectionCount = readBytes(4)
    header.numberOfCompilationDataSections = readBytes(4)
    skip(4)
    header.extraRecordDataFlags = readBytes(4)
    header.indxRecordOffset = readBytes(4)
    jumpTo(_offset + header.headerLength)
}

// skip
function parseExthHeader() {
    if (peakString(4) !== 'EXTH') {
        return
    }

    const _offset = offset
    console.log(readString(4))
    const headerLength = readBytes(4)
    console.log('exth header length', headerLength)
    let count = readBytes(4)
    console.log('record count', count)

    while (count--) {
        console.log('record type', readBytes(4))
        const recordLength = readBytes(4)
        console.log('record length', recordLength)
        console.log('record data', readString(recordLength - 8))
    }

    if (hasExthHeader) {
    }
}
export function handleMobi(file: File): Book {
    const reader = new FileReader()
    reader.onload = (e) => {
        const data = e.target?.result

        if (!data) {
            console.log('empty')
            return
        }

        dataView = new DataView(data as ArrayBuffer)
        parseMobiFile()
    }
    reader.readAsArrayBuffer(file)

    return {
        // title: fileTitle,
    }
}
export async function parse(rawContent: File): Promise<Book> {
    mobi = new MobiFile()
    return handleMobi(rawContent)
}
