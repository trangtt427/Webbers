/**
 * Homepage case study panel overlays.
 * Intercepts clicks on case study links and opens full-screen panels that slide
 * up from the bottom instead of navigating away.
 * Only active when matching panel elements exist (homepage only).
 *
 * URL strategy: hash routes (#/tactic, #/baby-design) on the homepage path.
 * Human Interest panel is dormant — featured HI links to human-interest.html.
 * The hash is never sent to the server, so refreshing reloads index.html and
 * the panel auto-reopens with a fade — no redirect, no blank screen.
 */
(function() {
  var fade = document.getElementById('hi-fade');
  var panels = [
    // Human Interest panel dormant — #hi-panel markup kept in index.html for future use
    {
      el: document.getElementById('tactic-panel'),
      hash: '#/tactic',
      sectionId: 'tactic',
      href: 'tactic'
    },
    {
      el: document.getElementById('baby-design-panel'),
      hash: '#/baby-design',
      sectionId: 'baby-design-ui',
      href: 'baby-design'
    }
  ].filter(function(p) { return p.el; });

  if (!panels.length) return;

  var activePanel = null;
  var isOpen = false;
  var isOpening = false;
  var openGeneration = 0;
  var lastOpenAt = 0;
  var basePath = window.location.pathname;
  var OPEN_GUARD_MS = 450;

  var scrollbarWidth = (function() {
    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll;';
    document.body.appendChild(probe);
    var w = probe.offsetWidth - probe.clientWidth;
    document.body.removeChild(probe);
    return w;
  })();

  function lockScroll() {
    document.documentElement.style.setProperty('--hi-sbw', scrollbarWidth + 'px');
    document.body.classList.add('hi-scroll-locked');
  }

  function unlockScroll() {
    document.body.classList.remove('hi-scroll-locked');
    document.documentElement.style.removeProperty('--hi-sbw');
  }

  function setOverlayActive(active) {
    document.body.classList.toggle('hi-panel-active', active);
  }

  function getPanelByHash(hash) {
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].hash === hash) return panels[i];
    }
    return null;
  }

  function isOverlayVisible() {
    return !!(fade && fade.classList.contains('is-visible'));
  }

  function animatePanelMedia(panel) {
    var wraps = panel.el.querySelectorAll('.hi-panel-media-wrap');
    for (var i = 0; i < wraps.length; i++) {
      wraps[i].classList.remove('hi-panel-media-in');
    }
    void panel.el.offsetWidth;
    for (var j = 0; j < wraps.length; j++) {
      wraps[j].classList.add('hi-panel-media-in');
    }
  }

  function clearPanelMediaAnimation(panel) {
    var wraps = panel.el.querySelectorAll('.hi-panel-media-wrap');
    for (var i = 0; i < wraps.length; i++) {
      wraps[i].classList.remove('hi-panel-media-in');
    }
  }

  function pausePanelVideos(panel) {
    var videos = panel.el.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) videos[i].pause();
  }

  function playPanelVideos(panel) {
    var videos = panel.el.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      videos[i].play().catch(function() {});
    }
  }

  function hideOtherPanels(panel) {
    for (var i = 0; i < panels.length; i++) {
      if (panels[i] !== panel) {
        panels[i].el.hidden = true;
        panels[i].el.classList.remove('is-open', 'hi-panel--restore');
        pausePanelVideos(panels[i]);
        clearPanelMediaAnimation(panels[i]);
      }
    }
  }

  function cancelPendingOpen() {
    openGeneration++;
    isOpening = false;
  }

  function syncCloseOverlay() {
    cancelPendingOpen();
    isOpen = false;
    activePanel = null;
    for (var i = 0; i < panels.length; i++) {
      panels[i].el.classList.remove('is-open', 'hi-panel--restore');
      panels[i].el.hidden = true;
      pausePanelVideos(panels[i]);
      clearPanelMediaAnimation(panels[i]);
      panels[i].el.scrollTop = 0;
    }
    if (fade) fade.classList.remove('is-visible');
    setOverlayActive(false);
    unlockScroll();
  }

  function pushPanelHistory(panel) {
    var state = window.history.state;
    if (state && state.caseStudyPanel === panel.hash && window.location.hash === panel.hash) return;
    history.pushState({ caseStudyPanel: panel.hash }, '', basePath + panel.hash);
  }

  function revealPanel(panel) {
    if (fade) fade.classList.add('is-visible');
    setOverlayActive(true);
    panel.el.hidden = false;
    void panel.el.offsetWidth;
    panel.el.classList.add('is-open');
    isOpening = false;
    animatePanelMedia(panel);
  }

  function openPanel(panel, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    var now = Date.now();
    if ((isOpen || isOpening || isOverlayVisible()) && activePanel === panel) {
      return;
    }
    if (now - lastOpenAt < OPEN_GUARD_MS && activePanel === panel) {
      return;
    }

    cancelPendingOpen();
    isOpening = true;

    if (isOpen && activePanel && activePanel !== panel) {
      activePanel.el.classList.remove('is-open');
      clearPanelMediaAnimation(activePanel);
      pausePanelVideos(activePanel);
    }

    hideOtherPanels(panel);
    isOpen = true;
    activePanel = panel;
    lastOpenAt = now;
    lockScroll();
    revealPanel(panel);
    pushPanelHistory(panel);
    playPanelVideos(panel);

    var backBtn = panel.el.querySelector('.hi-panel-back');
    if (backBtn) backBtn.focus();
  }

  function closePanel() {
    if (!isOpen && !isOpening && !isOverlayVisible()) return;
    syncCloseOverlay();
  }

  function restorePanel(panel) {
    history.replaceState(null, '', basePath);
    history.pushState({ caseStudyPanel: panel.hash }, '', basePath + panel.hash);
    isOpen = true;
    activePanel = panel;
    hideOtherPanels(panel);
    lockScroll();
    panel.el.hidden = false;
    panel.el.classList.add('hi-panel--restore');
    if (fade) fade.classList.add('is-visible');
    setOverlayActive(true);
    playPanelVideos(panel);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        panel.el.classList.add('is-open');
        animatePanelMedia(panel);
      });
    });
    panel.el.addEventListener('transitionend', function onRestore(ev) {
      if (ev.propertyName !== 'opacity') return;
      panel.el.removeEventListener('transitionend', onRestore);
      panel.el.classList.remove('hi-panel--restore');
      if (typeof window._revealHomepage === 'function') {
        window._revealHomepage();
        window._revealHomepage = null;
      }
      document.documentElement.classList.remove('hi-panel-restoring');
    });
  }

  var restorePanelMatch = getPanelByHash(window.location.hash);
  if (restorePanelMatch) restorePanel(restorePanelMatch);

  function blockTriggerWhileOverlay(e) {
    if (!isOpen && !isOpening && !isOverlayVisible()) return;
    e.preventDefault();
    e.stopPropagation();
  }

  for (var i = 0; i < panels.length; i++) {
    (function(panel) {
      var section = document.getElementById(panel.sectionId);
      if (!section) return;
      var triggers = section.querySelectorAll('a[href="' + panel.href + '"]');
      for (var j = 0; j < triggers.length; j++) {
        triggers[j].addEventListener('pointerdown', blockTriggerWhileOverlay, true);
        triggers[j].addEventListener('click', function(e) { openPanel(panel, e); });
      }
      var backBtn = panel.el.querySelector('.hi-panel-back');
      if (backBtn) {
        backBtn.addEventListener('click', function() {
          history.replaceState(null, '', basePath);
          closePanel();
        });
      }
    })(panels[i]);
  }

  if (fade) {
    fade.addEventListener('click', function() {
      if (!isOverlayVisible()) return;
      history.replaceState(null, '', basePath);
      syncCloseOverlay();
    });
  }

  window.addEventListener('popstate', function() {
    if (window.history.state && window.history.state.caseStudyPanel) return;
    if (isOpen || isOpening || isOverlayVisible()) {
      syncCloseOverlay();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && (isOpen || isOverlayVisible())) {
      history.replaceState(null, '', basePath);
      closePanel();
    }
  });
})();
