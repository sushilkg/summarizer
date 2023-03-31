const saveOptions = () => {
    const apiKey = document.getElementById('apiKey').value;
    const promptQuestion = document.getElementById('promptQuestion').value;
    const maxLength = document.getElementById('maxLength').value;
    const status = document.getElementById('status');

    chrome.storage.sync.set({
        apiKey: apiKey,
        promptQuestion: promptQuestion,
        maxLength: maxLength,
    }, function () {
        status.innerHTML = 'Options saved.';
        status.classList.remove('d-none');
        setTimeout(function () {
            status.innerHTML = '';
            status.classList.add('d-none');
        }, 2000);
    });
}

const restoreOptions = () => {
    chrome.storage.sync.get({
        apiKey: '',
        promptQuestion: 'Summarize the following text',
        maxLength: 5000,
    }, function (items) {
        document.getElementById('apiKey').value = items.apiKey;
        document.getElementById('promptQuestion').value = items.promptQuestion;
        document.getElementById('maxLength').value = items.maxLength;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    restoreOptions();
    document.getElementById('save').addEventListener('click', saveOptions);
});
