const _DEBUG = false;

_log = (str) => {
    if (_DEBUG) {
        console.log(`[RWTHOCDL] ${str}`)
    }
}


function getStreams(callback) {
    _log("Injecting inner script...");
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('/opencast-inject-inner.js');
    document.body.append(script);
    _log("Script injected!")
    script.onload = function () {
        _log("onload called!");
        setTimeout(() => {
            if (document.body.getAttribute('rwthocdl_hrefs') === "not_loaded") {
                script.remove();
                callback(null);
            } else {
                let hrefs = document.body.getAttribute('rwthocdl_hrefs').split('|');
                let resolutions = document.body.getAttribute('rwthocdl_res').split(',');
                let sources = []
                for (let i = 0; i < hrefs.length; i++) {
                    const href = hrefs[i];
                    const resWidth = resolutions[i].split('x')[0];
                    const resHeight = resolutions[i].split('x')[1];
                    sources.push({
                        src: href,
                        res: {
                            w: resWidth,
                            h: resHeight
                        }
                    });
                }

                script.remove();
                callback(sources);
            }

        }, 100)
    };
}

getStreams((sources) => { sendResult(sources) });
setInterval(() => getStreams((sources) => { sendResult(sources) }), 1000);

function sendResult(sources) {
    _log("Sending result...");
    chrome.runtime.sendMessage({ sources: sources }).catch((err) => { })
}