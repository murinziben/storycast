/*
 * audio-player.js — compact audio players for <div data-audio-player>.
 * A real <audio> element does the playback; the visible controls are a
 * button + range slider + time read-out. Without JS the native controls show.
 */
(function () {
  var fmt = window.StoryCast.formatTime;
  var spoken = window.StoryCast.spokenTime;
  var paint = window.StoryCast.paintRange;
  var players = [];

  document.querySelectorAll('[data-audio-player]').forEach(function (root) {
    var audio = root.querySelector('audio');
    var ui = root.querySelector('[data-ap-ui]');
    var btn = root.querySelector('[data-ap-button]');
    var seek = root.querySelector('[data-ap-seek]');
    var time = root.querySelector('[data-ap-time]');
    var title = root.getAttribute('data-title') || 'audio story';
    if (!audio || !ui) return;

    audio.controls = false;
    audio.removeAttribute('controls');
    ui.hidden = false;
    players.push(audio);

    function use(name) { btn.querySelector('use').setAttribute('href', '#i-' + name); }

    function sync() {
      seek.value = audio.currentTime;
      seek.setAttribute('aria-valuetext', spoken(audio.currentTime) + ' of ' + spoken(audio.duration));
      time.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
      paint(seek);
    }
    function setDuration() { if (isFinite(audio.duration)) { seek.max = audio.duration; sync(); } }

    btn.addEventListener('click', function () {
      if (audio.paused) {
        // Only one story plays at a time
        players.forEach(function (a) { if (a !== audio) a.pause(); });
        audio.play();
      } else {
        audio.pause();
      }
    });
    function syncButton() {
      var playing = !audio.paused && !audio.ended;
      btn.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + title);
      btn.setAttribute('aria-pressed', String(playing));
      use(playing ? 'pause' : 'play');
    }
    audio.addEventListener('play', syncButton);
    audio.addEventListener('pause', syncButton);
    audio.addEventListener('ended', syncButton);
    audio.addEventListener('loadedmetadata', setDuration);
    audio.addEventListener('durationchange', setDuration);
    audio.addEventListener('timeupdate', sync);
    seek.addEventListener('input', function () { audio.currentTime = parseFloat(seek.value); sync(); });
    if (audio.readyState >= 1) setDuration();
  });
})();
