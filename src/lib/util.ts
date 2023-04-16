const globalDOMParser = new DOMParser()

export function parseXML(text: string) {
    return globalDOMParser.parseFromString(text, 'text/xml')
}

export function parseHTML(text: string) {
    return globalDOMParser.parseFromString(text, 'text/html')
}
