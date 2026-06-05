/**
 * Human Interest case study panel overlay.
 * Intercepts clicks on the Human Interest links on the homepage and opens a
 * full-screen panel that slides up from the bottom instead of navigating away.
 * Only active when #hi-panel exists (homepage only).
 *
 * URL strategy: uses ?panel=human-interest on the homepage path so that
 * refreshing the page reloads index.html (not human-interest.html) and
 * the panel auto-reopens.
 */
(function() {
  var panel = document.getElementById('hi-panel');
  if (!panel) return;

  var fade = document.getElementById('hi-fade');
  var backBtn = panel.querySelector('.hi-panel-back');
  var video = panel.querySelector('video');
  var isOpen = false;

  var PANEL_PARAM = 'panel=human-interest';
  var basePath = window.location.pathname;

  function openPanel(e) {
    if (e) e.preventDefault();
    if (isOpen) return;
    isOpen = true;
    panel.hidden = false;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        panel.classList.add('is-open');
        if (fade) fade.classList.add('is-visible');
      });
    });
    // Lock the page scroll only after the slide-up finishes so the
    // browser scrollbar stays visible throughout the opening animation.
    panel.addEventListener('transitionend', function onOpen(e) {
      if (e.propertyName !== 'transform') return;
      panel.removeEventListener('transitionend', onOpen);
      document.body.style.overflow = 'hidden';
    });
    history.pushState({ hiPanel: true }, '', basePath + '?' + PANEL_PARAM);
    if (video) video.play().catch(function() {});
    if (backBtn) backBtn.focus();
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;
    // Restore the page scrollbar immediately so it's visible during the slide-down.
    document.body.style.overflow = '';
    panel.classList.remove('is-open');
    if (fade) fade.classList.remove('is-visible');
    if (video) video.pause();
    panel.scrollTop = 0;
    panel.addEventListener('transitionend', function onEnd(e) {
      if (e.propertyName !== 'transform') return;
      panel.removeEventListener('transitionend', onEnd);
      panel.hidden = true;
    });
  }

  // Auto-open when the page is loaded/refreshed with ?panel=human-interest in the URL.
  if (window.location.search.indexOf('panel=human-interest') !== -1) {
    // Normalise history so the browser back button returns cleanly to the homepage root.
    history.replaceState(null, '', basePath);
    history.pushState({ hiPanel: true }, '', basePath + '?' + PANEL_PARAM);
    // Open immediately without animation (this is a refresh, not a user click).
    isOpen = true;
    panel.hidden = false;
    panel.classList.add('is-open');
    if (fade) fade.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    if (video) video.play().catch(function() {});
  }

  // Intercept both Human Interest links on the homepage.
  var hiSection = document.getElementById('human-interest');
  if (hiSection) {
    var triggers = hiSection.querySelectorAll('a[href="human-interest"]');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', openPanel);
    }
  }

  // Back button: strip the query param from the URL and close the panel.
  // Using replaceState here (not history.back()) so it works correctly
  // whether the panel was opened normally or restored after a refresh.
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
