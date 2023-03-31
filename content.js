const parseAndSendDocument = () => {
    const clone = document.cloneNode(true)
    const parsed = new Readability(clone).parse()

    chrome.runtime.sendMessage({action: 'documentParsed', parsed: parsed});
}

document.addEventListener('DOMContentLoaded', function () {
    parseAndSendDocument()
})

window.onpopstate = () => {
    parseAndSendDocument()
}

parseAndSendDocument()