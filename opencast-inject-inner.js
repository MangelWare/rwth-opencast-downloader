(() => {
    try {
        let mp4Sources = window.paella.player.videoContainer.sourceData[0].sources.mp4;
        let hrefs = mp4Sources.map((s) => s.src).join('|');
        let resolutions = mp4Sources.map((s) => `${s.res.w}x${s.res.h}`).join(',');
        document.body.setAttribute("rwthocdl_hrefs", hrefs);
        document.body.setAttribute("rwthocdl_res", resolutions);
    } catch (error) {
        document.body.setAttribute("rwthocdl_hrefs", "not_loaded");
        document.body.setAttribute("rwthocdl_res", "not_loaded");
    }

})();