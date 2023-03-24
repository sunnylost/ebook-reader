chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('src/chrome-addon/entries/welcome.html'),
    })
})

export {}
