let player;
let currentPlaylistId = 'PLo5gSzCiINpTVIXHTLh829G6nlMJS7q6m';
const TARGET_SPEED = 1.5;

// Define your playlists here
const PLAYLISTS = [
    { id: 'PLo5gSzCiINpTVIXHTLh829G6nlMJS7q6m', name: 'Main List' },
    // { id: 'OTHER_ID', name: 'Other List' }
];

function onYouTubeIframeAPIReady() {
    initPlayer(currentPlaylistId);
    setupPlaylistUI();
}

function initPlayer(id) {
    if (player) {
        player.destroy();
    }
    
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            listType: 'playlist',
            list: id,
            playlist: id, // Required for loop to work with a playlist
            loop: 1,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function setupPlaylistUI() {
    const listContainer = document.getElementById('playlist-buttons');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    PLAYLISTS.forEach(pl => {
        const btn = document.createElement('button');
        btn.className = `playlist-btn ${pl.id === currentPlaylistId ? 'active' : ''}`;
        btn.textContent = pl.name;
        btn.title = pl.name;
        btn.onclick = () => switchPlaylist(pl.id);
        listContainer.appendChild(btn);
    });
}

function switchPlaylist(id) {
    if (id === currentPlaylistId) return;
    currentPlaylistId = id;
    initPlayer(id);
    setupPlaylistUI();
    
    // Reset start button
    const playBtn = document.getElementById('play-btn');
    playBtn.style.display = 'flex';
    playBtn.querySelector('.btn-text').textContent = 'PLAYLIST START';
}

function onPlayerReady(event) {
    console.log("Player Ready");
    const playBtn = document.getElementById('play-btn');
    const statusText = document.getElementById('status-text');

    // Remove old listeners to avoid stacking
    const newPlayBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newPlayBtn, playBtn);

    newPlayBtn.addEventListener('click', () => {
        player.playVideo();
        newPlayBtn.style.display = 'none';
        statusText.textContent = `Speed: ${TARGET_SPEED}x locked`;
    });

    player.setPlaybackRate(TARGET_SPEED);

    // Monitoring Loop
    if (window.monitorInterval) clearInterval(window.monitorInterval);
    window.monitorInterval = setInterval(() => {
        if (player && typeof player.getPlaybackRate === 'function') {
            const currentRate = player.getPlaybackRate();
            const state = player.getPlayerState();
            
            if (state === YT.PlayerState.PLAYING && currentRate !== TARGET_SPEED) {
                player.setPlaybackRate(TARGET_SPEED);
            }
        }
    }, 1000);
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
            // Looping fallback
            player.playVideoAt(0);
            statusText.textContent = "Looping...";
            break;
    }
}

function onPlayerError(event) {
    console.error("YouTube Player Error:", event.data);
    document.getElementById('status-text').textContent = "Error: Use Main App";
}
