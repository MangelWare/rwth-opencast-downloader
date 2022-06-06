# rwth-opencast-downloader
A Chrome extension to download videos available on the RWTH OpenCast Paella server.

### Usage

When you are on an RWTH Moodle page with an embedded Opencast video, start the video, and click on the extension.

The popup should show the available contents with their resolution. Click on one of the download buttons to start downloading the MP4 file.

### How does it work?

The extension doesn't do anything too involved, such as puzzling together pieces of the video.
Instead, links to the MP4 files are readily available, if you know where to look.

That is: `window.paella.player.videoContainer.sourceData[...].sources.mp4[...]`

The trickier thing is to extract this using a Chrome extension, as it usually doesn't allow direct access to the `window` object of the page, even with a content script.
Thus, the content script `opencast-inject.js` injects a second script `opencast-inject-inner.js` into the page itself by appending a `script` tag to the DOM, which sets some attributes with the needed data on the `body` element, and is removed afterwards.
This is done periodically every second.
