/*
 * video-player.js — accessible custom controls for <video data-video-player>.
 *
 * Progressive enhancement: the page ships with native `controls` so the video
 * works without JS. When this script runs it removes the native controls and
 * reveals the custom control bar, which is built from real <button>s and an
 * <input type="range">, so everything is reachable with Tab and operable with
 * Enter / Space.
 *
 * Keyboard shortcuts (while focus is anywhere inside the player):
 *   K  play / pause      C  captions on / off     M  mute / unmute
 *   F  fullscreen        ←  back 5 seconds        →  forward 5 seconds
 */
(function () {
  var fmt = window.StoryCast.formatTime;
  var spoken = window.StoryCast.spokenTime;
  var paint = window.StoryCast.paintRange;

  document.querySelectorAll('[data-video-player]').forEach(function (root) {
    var video = root.querySelector('video');
    var big = root.querySelector('[data-vp-big]');
    var controls = root.querySelector('[data-vp-controls]');
    var seek = root.querySelector('[data-vp-seek]');
    var playBtn = root.querySelector('[data-vp-play]');
    var backBtn = root.querySelector('[data-vp-back]');
    var muteBtn = root.querySelector('[data-vp-mute]');
    var ccBtn = root.querySelector('[data-vp-cc]');
    var fsBtn = root.querySelector('[data-vp-fs]');
    var timeEl = root.querySelector('[data-vp-time]');
    var live = root.querySelector('[data-vp-live]');
    var title = root.getAttribute('data-title') || 'video';
    if (!video || !controls) return;

    // Swap native controls for custom ones
    video.controls = false;
    video.removeAttribute('controls');
    controls.hidden = false;
    if (big) big.hidden = false;

    function icon(btn, name) {
      var use = btn.querySelector('use');
      if (use) use.setAttribute('href', '#i-' + name);
    }
    function announce(msg) { if (live) live.textContent = msg; }

    // --- Play / pause --------------------------------------------------
    function toggle() { if (video.paused) { video.play(); } else { video.pause(); } }
    function syncPlay() {
      var playing = !video.paused && !video.ended;
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      icon(playBtn, playing ? 'pause' : 'play');
      if (playing && big) big.hidden = true;
    }
    video.addEventListener('play', syncPlay);
    video.addEventListener('pause', syncPlay);
    video.addEventListener('ended', syncPlay);
    playBtn.addEventListener('click', toggle);
    video.addEventListener('click', toggle);
    if (big) {
      big.addEventListener('click', function () {
        video.play();
        playBtn.focus(); // keep keyboard users inside the player
      });
    }

    // --- Seek bar & time ----------------------------------------------
    function syncTime() {
      seek.value = video.currentTime;
      seek.setAttribute('aria-valuetext', spoken(video.currentTime) + ' of ' + spoken(video.duration));
      timeEl.textContent = fmt(video.currentTime) + ' / ' + fmt(video.duration);
      paint(seek);
    }
    function syncDuration() {
      if (isFinite(video.duration)) { seek.max = video.duration; syncTime(); }
    }
    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('timeupdate', syncTime);
    seek.addEventListener('input', function () { video.currentTime = parseFloat(seek.value); syncTime(); });
    if (video.readyState >= 1) syncDuration();

    function skip(delta) {
      video.currentTime = Math.min(Math.max(0, video.currentTime + delta), video.duration || Infinity);
    }
    backBtn.addEventListener('click', function () { skip(-10); });

    // --- Mute -----------------------------------------------------------
    function toggleMute() {
      video.muted = !video.muted;
      muteBtn.setAttribute('aria-pressed', String(video.muted));
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
      icon(muteBtn, video.muted ? 'volume-x' : 'volume-2');
      announce(video.muted ? 'Muted' : 'Sound on');
    }
    muteBtn.addEventListener('click', toggleMute);

    // --- Captions -------------------------------------------------------
    function track() { return video.textTracks && video.textTracks[0]; }
    function setCaptions(on) {
      var t = track();
      if (t) t.mode = on ? 'showing' : 'hidden';
      ccBtn.setAttribute('aria-pressed', String(on));
      announce(on ? 'Captions on' : 'Captions off');
    }
    function toggleCaptions() { setCaptions(ccBtn.getAttribute('aria-pressed') !== 'true'); }
    ccBtn.addEventListener('click', toggleCaptions);
    // Captions are on by default (the <track> is marked default)
    ccBtn.setAttribute('aria-pressed', 'true');
    if (track()) track().mode = 'showing';
    video.addEventListener('loadedmetadata', function () { if (ccBtn.getAttribute('aria-pressed') === 'true' && track()) track().mode = 'showing'; });

    // --- Fullscreen -----------------------------------------------------
    function isFs() { return document.fullscreenElement === root; }
    function toggleFs() {
      if (root.requestFullscreen) {
        if (isFs()) { document.exitFullscreen(); } else { root.requestFullscreen(); }
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iOS Safari: video-only fullscreen
      }
    }
    fsBtn.addEventListener('click', toggleFs);
    document.addEventListener('fullscreenchange', function () {
      var on = isFs();
      fsBtn.setAttribute('aria-pressed', String(on));
      fsBtn.setAttribute('aria-label', on ? 'Exit fullscreen' : 'Fullscreen');
      icon(fsBtn, on ? 'minimize' : 'maximize');
    });

    // --- Keyboard shortcuts --------------------------------------------
    root.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var onSlider = e.target === seek;
      switch (e.key.toLowerCase()) {
        case 'k': e.preventDefault(); toggle(); break;
        case 'c': toggleCaptions(); break;
        case 'm': toggleMute(); break;
        case 'f': toggleFs(); break;
        case 'arrowleft':  if (!onSlider) { e.preventDefault(); skip(-5); } break;
        case 'arrowright': if (!onSlider) { e.preventDefault(); skip(5); } break;
      }
    });

    // --- Errors ---------------------------------------------------------
    video.addEventListener('error', function () {
      announce('Sorry, ' + title + ' could not be loaded. Please read the transcript below.');
    });
  });
})();
