import {getCurrentURL, openOptionsPage} from "./background.js";

const summarizeAndOutput = async () => {
    getCurrentURL().then((url) => {
        document.getElementById("title").innerHTML = url
    });
    document.getElementById("summary").innerHTML = "Loading..."

    chrome.runtime.sendMessage({action: 'loadSummary'}, async (response) => {
        displaySummary(response);
    });
}

const displaySummary = (summary) => {
    document.getElementById("title").innerHTML = summary.title;
    document.getElementById("summary").innerHTML = summary.summary;
}

document.addEventListener('DOMContentLoaded', function () {
    summarizeAndOutput().then(() => {
        console.log("Summarized")
    }).catch((error) => {
        console.log(error)
    })

    document.querySelector('body').addEventListener('click', async (event) => {
        if (event.target.matches('#go-to-options')) {
            openOptionsPage();
        }
    });
});