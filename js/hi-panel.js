/**
 * Human Interest case study panel overlay.
 * Intercepts clicks on the Human Interest links on the homepage and opens a
 * full-screen panel that slides up from the bottom instead of navigating away.
 * Only active when #hi-panel exists (homepage only).
 *
 * URL strategy: uses the hash route #/human-interest on the homepage path.
 * The hash is never sent to the server, so refreshing reloads index.html
 * (not human-interest.html) and the panel auto-reopens with a fade —
 * no redirect, no blank screen, and no "?" query string.
 */
(function() {
  var panel = document.getElementById('hi-panel');
  if (!panel) return;

  var fade = document.getElementById('hi-fade');
  var backBtn = panel.querySelector('.hi-panel-back');
  var video = panel.querySelector('video');
  var isOpen = false;

  var PANEL_HASH = '#/human-interest';
  var basePath = window.location.pathname;

  // Width of the classic scrollbar, measured with an offscreen probe so it works
  // regardless of the current overflow state (returns 0 for overlay scrollbars).
  var scrollbarWidth = (function() {
    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll;';
    document.body.appendChild(probe);
    var w = probe.offsetWidth - probe.clientWidth;
    document.body.removeChild(probe);
    return w;
  })();

  // Lock the page scroll and remove the homepage scrollbar. The removed scrollbar
  // width is exposed as --hi-sbw so CSS can compensate BOTH the in-flow body
  // content and the fixed header by that amount — keeping everything in place so
  // there's no jump when the panel opens or closes. (The homepage scrollbar is
  // truly gone, not just hidden behind the panel, so it can't paint on top.)
  function lockScroll() {
    document.documentElement.style.setProperty('--hi-sbw', scrollbarWidth + 'px');
    document.body.classList.add('hi-scroll-locked');
  }
  function unlockScroll() {
    document.body.classList.remove('hi-scroll-locked');
    document.documentElement.style.removeProperty('--hi-sbw');
  }

  // Run the media scale-in once per open. Using a dedicated class (not .is-open)
  // prevents the animation from restarting when other panel classes change.
  function animatePanelMedia() {
    var wraps = panel.querySelectorAll('.hi-panel-media-wrap');
    for (var i = 0; i < wraps.length; i++) {
      wraps[i].classList.remove('hi-panel-media-in');
    }
    void panel.offsetWidth;
    for (var j = 0; j < wraps.length; j++) {
      wraps[j].classList.add('hi-panel-media-in');
    }
  }

  function clearPanelMediaAnimation() {
    var wraps = panel.querySelectorAll('.hi-panel-media-wrap');
    for (var i = 0; i < wraps.length; i++) {
      wraps[i].classList.remove('hi-panel-media-in');
    }
  }

  function openPanel(e) {
    if (e) e.preventDefault();
    if (isOpen) return;
    isOpen = true;
    // Lock immediately so the homepage scrollbar is gone before the panel rises.
    lockScroll();
    panel.hidden = false;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        panel.classList.add('is-open');
        if (fade) fade.classList.add('is-visible');
        animatePanelMedia();
      });
    });
    history.pushState({ hiPanel: true }, '', basePath + PANEL_HASH);
    if (video) video.play().catch(function() {});
    if (backBtn) backBtn.focus();
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    clearPanelMediaAnimation();
    if (fade) fade.classList.remove('is-visible');
    if (video) video.pause();
    panel.scrollTop = 0;
    // Keep the page locked through the slide-down so the panel covers the page
    // the whole way; restore the homepage scrollbar once it's fully closed.
    panel.addEventListener('transitionend', function onEnd(ev) {
      if (ev.propertyName !== 'transform') return;
      panel.removeEventListener('transitionend', onEnd);
      panel.hidden = true;
      unlockScroll();
    });
  }

  // Auto-open when the page is loaded/refreshed with the #/human-interest hash.
  // The solid restore scrim covers the homepage, then the panel fades in over it.
  if (window.location.hash === PANEL_HASH) {
    // Normalise history so the browser back button returns cleanly to the homepage root.
    history.replaceState(null, '', basePath);
    history.pushState({ hiPanel: true }, '', basePath + PANEL_HASH);
    isOpen = true;
    lockScroll();
    panel.hidden = false;
    panel.classList.add('hi-panel--restore'); // opacity-only fade, no slide
    if (fade) fade.classList.add('is-visible');
    if (video) video.play().catch(function() {});
    // Double rAF paints the opacity:0 panel over the solid screen before the fade.
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        panel.classList.add('is-open');
        animatePanelMedia();
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

  // Back button: strip the hash from the URL and close the panel.
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
