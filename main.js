let player;
const playlistId = 'PLo5gSzCiINpTVIXHTLh829G6nlMJS7q6m';
const TARGET_SPEED = 1.5;

function onYouTubeIframeAPIReady() {
    console.log("YouTube API Ready");
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            listType: 'playlist',
            list: playlistId,
            playsinline: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log("Player Ready");
    const playBtn = document.getElementById('play-btn');
    const statusText = document.getElementById('status-text');

    playBtn.addEventListener('click', () => {
        player.playVideo();
        playBtn.style.display = 'none'; // Only show at the start or if paused
        statusText.textContent = `Speed: ${TARGET_SPEED}x locked`;
    });

    // Initial speed setting
    player.setPlaybackRate(TARGET_SPEED);

    // Monitoring Loop: Periodically ensure speed is 1.5x
    setInterval(() => {
        if (player && typeof player.getPlaybackRate === 'function') {
            const currentRate = player.getPlaybackRate();
            const state = player.getPlayerState();
            
            // If playing and speed is wrong, force it back
            if (state === YT.PlayerState.PLAYING && currentRate !== TARGET_SPEED) {
                console.log(`Speed correction: ${currentRate} -> ${TARGET_SPEED}`);
                player.setPlaybackRate(TARGET_SPEED);
            }
        }
    }, 1000); // Check every second
}

function onPlayerStateChange(event) {
    const statusText = document.getElementById('status-text');
    const playBtn = document.getElementById('play-btn');

    switch (event.data) {
        case YT.PlayerState.PLAYING:
            statusText.textContent = `Playing @ ${TARGET_SPEED}x`;
            statusText.style.color = '#4deeea';
            player.setPlaybackRate(TARGET_SPEED);
            playBtn.style.display = 'none';
            break;
        case YT.PlayerState.PAUSED:
            statusText.textContent = "Paused";
            statusText.style.color = '#ff4d4d';
            playBtn.style.display = 'flex';
            playBtn.querySelector('.btn-text').textContent = 'RESUME';
            break;
        case YT.PlayerState.ENDED:
            statusText.textContent = "Finished";
            break;
    }
}

function onPlayerError(event) {
    console.error("YouTube Player Error:", event.data);
    document.getElementById('status-text').textContent = "Connection Error";
}
