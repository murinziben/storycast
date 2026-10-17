/*
 * nav.js — mobile navigation toggle (progressive enhancement).
 * Without JS the nav is simply visible. With JS it collapses on small screens
 * and is controlled by the menu button (aria-expanded / aria-controls).
 */
(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  toggle.hidden = false; // the button only exists for JS users

  var openIcon = toggle.querySelector('[data-icon-open]');
  var closeIcon = toggle.querySelector('[data-icon-close]');

  function setOpen(open) {
    nav.setAttribute('data-collapsed', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (openIcon) openIcon.hidden = open;
    if (closeIcon) closeIcon.hidden = !open;
  }

  setOpen(false);

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Escape closes the menu and returns focus to the button
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
})();
