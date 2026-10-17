/*
 * transcript.js — "Show full transcript" toggle.
 * Without JS the whole transcript is visible. With JS only the first few
 * lines show until the button (aria-expanded / aria-controls) is pressed.
 */
(function () {
  var wrap = document.querySelector('[data-transcript]');
  if (!wrap) return;
  var extra = wrap.querySelectorAll('[data-transcript-extra]');
  var button = wrap.querySelector('[data-transcript-toggle]');
  if (!extra.length || !button) return;

  var label = button.querySelector('[data-label]');

  function setExpanded(expanded) {
    extra.forEach(function (el) { el.hidden = !expanded; });
    button.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? 'Show less' : 'Show full transcript';
  }

  button.hidden = false;
  setExpanded(false);
  button.addEventListener('click', function () {
    setExpanded(button.getAttribute('aria-expanded') !== 'true');
  });
})();
