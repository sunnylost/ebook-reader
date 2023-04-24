export type PDBHeader = {
    name: string
    attributes: number
    version: number
    createTime: number
    modificationTime: number
    lastBackupTime: number
    modificationNumber: number
    appInfoId: number
    sortInfoId: number
    type: string
    creator: string
    uniqueIDSeed: number
    nextRecordListId: number
    numberOfRecords: number
}

export type PalmHeader = {
    compression: number
    unused: number
    textLength: number
    recordCount: number
    recordSize: number
    currentPosition: number
}

export type MobiHeader = {
    identifier: string
    headerLength: number
    mobiType: number
    textEncoding: number
    uniqueID: number
    fileVersion: number
    ortographicIndex: number
    inflectionIndex: number
    indexNames: number
    indexKeys: number
    extraIndex0: number
    extraIndex1: number
    extraIndex2: number
    extraIndex3: number
    extraIndex4: number
    extraIndex5: number
    firstNoneBookIndex: number
    fullNameOffset: number
    fullNameLength: number
    locale: number
    inputLanguage: number
    outputLanguage: number
    miniVersion: number
    firstImageIndex: number
    huffmanRecordOffset: number
    huffmanRecordCount: number
    huffmanTableOffset: number
    huffmanTableLength: number
    exthFlags: number
    drmOffset: number
    drmCount: number
    drmSize: number
    drmFlags: number
    firstContentRecordNumber: number
    lastContentRecordNumber: number
    flisRecordNumber: number
    unknownFlisRecordCount: number
    fcisRecordNumber: number
    unknownFcisRecordCount: number
    firstCompilationDataSectionCount: number
    numberOfCompilationDataSections: number
    extraRecordDataFlags: number
    indxRecordOffset: number
}

export type EXTHHeader = {}
