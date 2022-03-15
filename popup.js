chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        console.log("Received a message!");
        // get current tab
        let queryOptions = { active: true, currentWindow: true };
        let [currentTab] = await chrome.tabs.query(queryOptions);

        // check if from current tab
        if (sender.tab && sender.tab.id === currentTab.id) {
            const { sources } = request;
            setState(sources);
        }
    }
)

function setState(sources) {
    const contentPlaceholder = document.getElementById('content-placeholder')
    const loadingIndicator = document.getElementById('loading-indicator')
    const downloadOptionsDiv = document.getElementById('download-options');
    if (sources !== null && sources.length > 0) {
        contentPlaceholder.setAttribute("hidden", "");
        loadingIndicator.setAttribute("hidden", "");
        optionsHTML = sources.map((source) =>
            `<div class="download-option">
            <a class="material-icons download-btn" href="${source.src}" download>
                file_download
            </a>
            <span>${source.res.w}x${source.res.h}</span>
        </div>`
        ).join('\n');
        downloadOptionsDiv.innerHTML = optionsHTML;
    } else {
        contentPlaceholder.removeAttribute('hidden');
        loadingIndicator.removeAttribute('hidden');
        downloadOptionsDiv.innerHTML = "";
    }
}