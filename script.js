const video = document.getElementById('video');
const videoSrc = 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8';

let hls = null;
if (Hls.isSupported()) {
    hls = new Hls();

    hls.on(Hls.Events.LEVEL_LOADED, onHlsLevelLoaded);
    hls.on(Hls.Events.MANIFEST_LOADED, onHlsManifestLoaded);
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
}
else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
}

const SecondsToTime = (seconds) => seconds > 3600 ?
    new Date(seconds * 1000).toISOString().slice(11, 19)
    : new Date(seconds * 1000).toISOString().slice(14, 19);


const currentTime = document.getElementsByClassName('time-current')[0];
const totalTime = document.getElementsByClassName('time-total')[0];


const currentBuffer = document.getElementsByClassName('buffer-current')[0];
const rewindControl = document.getElementsByClassName('rewind')[0];

function onHlsLevelLoaded(event, data) {
    let level_duration = data.details.totalduration;
    rewindControl.max = level_duration;
    totalTime.innerText = SecondsToTime(level_duration);
}
function onHlsManifestLoaded(event, data) {

    document.getElementsByClassName('stats-levels')[0].innerText = data.levels.length;
    document.getElementsByClassName('stats-audio')[0].innerText = data.audioTracks.length;

}

setInterval(function () {
    currentTime.innerText = SecondsToTime(video.currentTime);
    currentBuffer.innerText = SecondsToTime(hls == null ? 0 : hls.ttfbEstimate);
    rewindControl.value = video.currentTime;
}, 100);

rewindControl.addEventListener('input', function () {
    video.currentTime = rewindControl.value;
});

const playpause = document.getElementsByClassName('playpause')[0];
playpause.onclick = function () {
    if (video.paused) {
        playpause.children[0].classList.replace('bi-play', 'bi-pause');
        video.play();
    }
    else {
        playpause.children[0].classList.replace('bi-pause', 'bi-play');
        video.pause();
    }
}

const videoContainer = video.parentElement;
let isFullscreen = false;
const fullscreenontrol = document.getElementsByClassName('fullscreen')[0];
function toggleFullscreen() {
    (videoContainer.webkitRequestFullscreen
        || videoContainer.mozRequestFullScreen
        || videoContainer.msRequestFullscreen
        || videoContainer.RequestFullscreen)
        .call(videoContainer);
    if (isFullscreen) {
        document.exitFullscreen(videoContainer);
    };
    isFullscreen = !isFullscreen;
    fullscreenontrol.classList.toggle('crossed');
}

let isPip = false;
const pipControl = document.getElementsByClassName('pip')[0];
function togglePip() {
    (video.webkitrequestPictureInPicture
        || video.mozrequestPictureInPicture
        || video.msrequestPictureInPicture
        || video.requestPictureInPicture)
        .call(video);
    if (isPip) {
        document.exitPictureInPicture();
    };
    isPip = !isPip;
    pipControl.classList.toggle('crossed');
}

const subtitleControl = document.getElementsByClassName('subtitle')[0];
function toggleSubtitle() {
    subtitleControl.classList.toggle('crossed');
    if (hls != null)
        hls.subtitleDisplay = !hls.subtitleDisplay;
}