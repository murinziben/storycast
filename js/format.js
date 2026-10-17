/* format.js — tiny shared helpers (loaded before the player scripts). */
window.StoryCast = window.StoryCast || {};

// 725.4 → "12:05"; 3725 → "1:02:05"
window.StoryCast.formatTime = function (seconds) {
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  return h > 0 ? h + ':' + pad(m) + ':' + pad(s) : m + ':' + pad(s);
};

// Spoken version for aria-valuetext: "2 minutes 5 seconds"
window.StoryCast.spokenTime = function (seconds) {
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  var m = Math.floor(seconds / 60);
  var s = Math.floor(seconds % 60);
  var parts = [];
  if (m) parts.push(m + (m === 1 ? ' minute' : ' minutes'));
  parts.push(s + (s === 1 ? ' second' : ' seconds'));
  return parts.join(' ');
};

// Keeps the filled part of a styled range input in sync (CSS var --progress)
window.StoryCast.paintRange = function (input) {
  var max = parseFloat(input.max) || 0;
  var pct = max > 0 ? (parseFloat(input.value) / max) * 100 : 0;
  input.style.setProperty('--progress', pct + '%');
};
