/**
 * Human Interest case study panel overlay.
 * Intercepts clicks on the Human Interest links on the homepage and opens a
 * full-screen panel that slides up from the bottom instead of navigating away.
 * Only active when #hi-panel exists (homepage only).
 *
 * URL strategy: pushState to /human-interest when the panel opens (clean path,
 * no query param). human-interest.html sets a sessionStorage flag and redirects
 * to the homepage so refreshing /human-interest still loads the panel here.
 */
(function() {
  var panel = document.getElementById('hi-panel');
  if (!panel) return;

  var fade = document.getElementById('hi-fade');
  var backBtn = panel.querySelector('.hi-panel-back');
  var video = panel.querySelector('video');
  var isOpen = false;

  // Capture the homepage path before any pushState calls.
  var basePath = window.location.pathname;
  // Resolve the panel path relative to the current directory.
  var panelPath = basePath.replace(/\/[^\/]*$/, '') + '/human-interest';

  function openPanel(e) {
    if (e) e.preventDefault();
    if (isOpen) return;
    isOpen = true;
    try { sessionStorage.setItem('hiPanel', '1'); } catch (err) {}
    panel.hidden = false;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        panel.classList.add('is-open');
        if (fade) fade.classList.add('is-visible');
      });
    });
    // Lock the page scroll only after the slide-up finishes so the
    // browser scrollbar stays visible throughout the opening animation.
    panel.addEventListener('transitionend', function onOpen(ev) {
      if (ev.propertyName !== 'transform') return;
      panel.removeEventListener('transitionend', onOpen);
      document.body.style.overflow = 'hidden';
    });
    history.pushState({ hiPanel: true }, '', panelPath);
    if (video) video.play().catch(function() {});
    if (backBtn) backBtn.focus();
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;
    try { sessionStorage.removeItem('hiPanel'); } catch (err) {}
    // Restore the page scrollbar immediately so it's visible during the slide-down.
    document.body.style.overflow = '';
    panel.classList.remove('is-open');
    if (fade) fade.classList.remove('is-visible');
    if (video) video.pause();
    panel.scrollTop = 0;
    panel.addEventListener('transitionend', function onEnd(ev) {
      if (ev.propertyName !== 'transform') return;
      panel.removeEventListener('transitionend', onEnd);
      panel.hidden = true;
    });
  }

  // Auto-open when human-interest.html redirected here with the sessionStorage flag.
  // A solid screen (the scrim filled with var(--bg)) masks the redirect blank,
  // then the panel content fades in over it — no slide.
  var shouldRestore = false;
  try { shouldRestore = sessionStorage.getItem('hiPanel') === '1'; } catch (err) {}
  if (shouldRestore) {
    try { sessionStorage.removeItem('hiPanel'); } catch (err) {}
    // Normalise history so the browser back button returns cleanly to the homepage.
    history.replaceState(null, '', basePath);
    history.pushState({ hiPanel: true }, '', panelPath);
    isOpen = true;
    panel.hidden = false;
    panel.classList.add('hi-panel--restore'); // opacity-only fade, no slide
    if (fade) fade.classList.add('is-visible');
    if (video) video.play().catch(function() {});
    // Double rAF paints the opacity:0 panel over the solid screen before the
    // fade begins.
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        panel.classList.add('is-open');
      });
    });
    panel.addEventListener('transitionend', function onRestore(ev) {
      if (ev.propertyName !== 'opacity') return;
      panel.removeEventListener('transitionend', onRestore);
      panel.classList.remove('hi-panel--restore');
      // Snap the homepage to its final visible state while hi-panel-restoring
      // still suppresses transitions, then remove the class.
      if (typeof window._revealHomepage === 'function') {
        window._revealHomepage();
        window._revealHomepage = null;
      }
      document.documentElement.classList.remove('hi-panel-restoring');
      document.body.style.overflow = 'hidden';
    });
  }

  // Intercept both Human Interest links on the homepage.
  var hiSection = document.getElementById('human-interest');
  if (hiSection) {
    var triggers = hiSection.querySelectorAll('a[href="human-interest"]');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', openPanel);
    }
  }

  // Back button: navigate back to the homepage URL and close the panel.
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      history.replaceState(null, '', basePath);
      closePanel();
    });
  }

  // Browser back button fires popstate — close the panel.
  window.addEventListener('popstate', function() {
    if (isOpen) closePanel();
  });

  // Escape key.
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      history.replaceState(null, '', basePath);
      closePanel();
    }
  });
})();
