let player;
const playlistId = 'PLo5gSzCiINpTVIXHTLh829G6nlMJS7q6m';
const TARGET_SPEED = 1.5;

function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
                height: '100%',
                width: '100%',
                playerVars: {
                              listType: 'playlist',
                              list: playlistId,
                              playsinline: 1
                },
                events: {
                              'onReady': onPlayerReady
                }
      });
}

function onPlayerReady(event) {
      const playBtn = document.getElementById('play-btn');
      const statusText = document.getElementById('status-text');

    playBtn.addEventListener('click', () => {
              player.playVideo();
              playBtn.style.display = 'none';
              statusText.textContent = `Speed: ${TARGET_SPEED}x locked`;
    });

    player.setPlaybackRate(TARGET_SPEED);

    setInterval(() => {
              if (player && typeof player.getPlaybackRate === 'function') {
                            const currentStatus = player.getPlaybackRate();
                            const state = player.getPlayerState();
                            if (state === YT.PlayerState.PLAYING && currentStatus !== TARGET_SPEED) {
                                              player.setPlaybackRate(TARGET_SPEED);
                            }
              }
    }, 1000);
}
