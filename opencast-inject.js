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
            if (document.body.getAttribute('rwthocdl_contents') === "not_loaded") {
                script.remove();
                callback(null);
            } else {
                let contents = document.body.getAttribute('rwthocdl_contents').split(',');
                _log(contents)
                let res = {}
                contents.forEach((content) => {
                    let hrefs = document.body.getAttribute(`rwthocdl_${content}_hrefs`).split('|');
                    let resolutions = document.body.getAttribute(`rwthocdl_${content}_res`).split(',');
                    res[content] = { sources: [] }
                    for (let i = 0; i < hrefs.length; i++) {
                        const href = hrefs[i];
                        const resWidth = resolutions[i].split('x')[0];
                        const resHeight = resolutions[i].split('x')[1];
                        res[content].sources.push({
                            src: href,
                            res: {
                                w: resWidth,
                                h: resHeight
                            }
                        });
                    }
                })

                script.remove();
                callback(res);
            }

        }, 100)
    };
}

getStreams((res) => { sendResult(res) });
setInterval(() => getStreams((res) => { sendResult(res) }), 1000);

function sendResult(res) {
    _log("Sending result...");
    chrome.runtime.sendMessage(res).catch((err) => { })
}