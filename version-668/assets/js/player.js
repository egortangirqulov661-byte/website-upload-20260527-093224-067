(function () {
    window.startMoviePlayer = function (videoId, buttonId, streamUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var cover = button;
        var started = false;
        var hlsInstance = null;

        if (!video || !button || !streamUrl) {
            return;
        }

        function activate() {
            if (started) {
                var replay = video.play();
                if (replay && typeof replay.catch === 'function') {
                    replay.catch(function () {});
                }
                return;
            }
            started = true;
            video.setAttribute('controls', 'controls');
            if (cover) {
                cover.classList.add('is-hidden');
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            var playTask = video.play();
            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {});
            }
        }

        button.addEventListener('click', activate);
        video.addEventListener('click', function () {
            if (!started) {
                activate();
            }
        });
        window.addEventListener('pagehide', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    };
})();
