import {getSummaryFromArticle} from './summarizer.js';

const page = {
    content: null, summary: null, title: null,
}

const openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.location.href = chrome.runtime.getURL('options.html')
    }
}

const getOpenAIKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
            apiKey: '',
        }, function (items) {
            resolve(items.apiKey)
        });
    })
}

const getPromptQuestion = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
            promptQuestion: '',
        }, function (items) {
            resolve(items.promptQuestion)
        });
    })
}

const getMaxLengthToSummarize = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
            maxLength: '',
        }, function (items) {
            resolve(items.maxLength)
        });
    })
}

const getCurrentURL = async () => {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);

    if (tab && tab.url) {
        return tab.url;
    }

    return null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'documentParsed') {
        page.title = message.parsed.title;
        page.content = message.parsed.content;

        return false;
    }

    if (message.action === 'loadSummary') {
        getSummaryFromArticle(page.content).then((summary) => {
            page.summary = summary;
            return sendResponse(page);
        })

        return true;
    }

    return false;
});

export {
    openOptionsPage, getOpenAIKey, getPromptQuestion, getMaxLengthToSummarize, getCurrentURL
}
