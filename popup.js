chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        // get current tab
        let queryOptions = { active: true, currentWindow: true };
        let [currentTab] = await chrome.tabs.query(queryOptions);

        // check if from current tab
        if (sender.tab && sender.tab.id === currentTab.id) {
            setState(request);
        }
    }
)

function setState(request) {
    console.log("Got request:\n" + JSON.stringify(request, null, 2))
    const contentPlaceholder = document.getElementById('content-placeholder')
    const loadingIndicator = document.getElementById('loading-indicator')
    const downloadOptionsDiv = document.getElementById('download-options');

    if (request && Object.keys(request).length > 0) {
        contentPlaceholder.setAttribute("hidden", "");
        loadingIndicator.setAttribute("hidden", "");
        contentHTMLs = Object.keys(request).map(content => {
            sourceHTMLs = request[content].sources.map((source) =>
                `<div class="download-option">
                    <a class="material-icons download-btn" href="${source.src}" download>
                        file_download
                    </a>
                    <span>${source.res.w}x${source.res.h}</span>
                </div>`
            )
            return `<span class="content-heading">${translateContentName(content)}</span>\n${sourceHTMLs.join('\n')}`
        });
        downloadOptionsDiv.innerHTML = contentHTMLs.join('\n');
    } else {
        contentPlaceholder.removeAttribute('hidden');
        loadingIndicator.removeAttribute('hidden');
        downloadOptionsDiv.innerHTML = "";
    }
}

function translateContentName(name) {
    switch (name) {
        case "presenter":
            return "Dozent:in"
            break;
        case "presentation":
            return "Präsentation"
        default:
            return name[0].toUpperCase() + name.substring(1);
    }
}