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
      el: document.getElementById('squarespace-qr-panel'),
      hash: '#/squarespace-qr-codes',
      sectionId: 'squarespace-qr-codes',
      href: 'squarespace-qr-codes'
    },
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
  var isAnimatingOpen = false;
  var triggersLocked = false;
  var basePath = window.location.pathname;
  var SLIDE_MS = 580;
  var FADE_DISMISS_DELAY_MS = 120;
  var TAP_SLOP = 12;
  var triggerBindings = [];
  var panelHrefs = panels.map(function(p) { return p.href; });
  var fadeDismissTimer = null;

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

  function isPanelInteractionBlocked() {
    return triggersLocked || isOpen || isAnimatingOpen || isOverlayVisible();
  }

  function isPanelTrigger(el) {
    if (!el || !el.closest) return false;
    var link = el.closest('a');
    if (!link) return false;
    var href = link.getAttribute('href') || '';
    for (var i = 0; i < panelHrefs.length; i++) {
      if (href === panelHrefs[i]) return true;
    }
    return false;
  }

  function blockPanelTriggerEvent(e) {
    if (!isPanelInteractionBlocked()) return;
    if (!isPanelTrigger(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
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

  function resetPanelScroll(panel) {
    panel.el.scrollTop = 0;
    panel.el.scrollLeft = 0;
  }

  function hideOtherPanels(panel) {
    for (var i = 0; i < panels.length; i++) {
      if (panels[i] !== panel) {
        resetPanelScroll(panels[i]);
        panels[i].el.hidden = true;
        panels[i].el.classList.remove('is-open', 'hi-panel--restore');
        pausePanelVideos(panels[i]);
        clearPanelMediaAnimation(panels[i]);
      }
    }
  }

  function clearSlideListener(panel) {
    if (panel._slideEndHandler) {
      panel.el.removeEventListener('transitionend', panel._slideEndHandler);
      panel._slideEndHandler = null;
    }
    if (panel._slideFallbackTimer) {
      clearTimeout(panel._slideFallbackTimer);
      panel._slideFallbackTimer = null;
    }
  }

  function disableFadeDismiss() {
    if (fadeDismissTimer) {
      clearTimeout(fadeDismissTimer);
      fadeDismissTimer = null;
    }
    if (fade) fade.classList.remove('hi-fade--dismissable');
  }

  function scheduleFadeDismiss() {
    disableFadeDismiss();
    if (!fade || !isOpen) return;
    fadeDismissTimer = setTimeout(function() {
      fadeDismissTimer = null;
      if (isOpen && fade) fade.classList.add('hi-fade--dismissable');
    }, FADE_DISMISS_DELAY_MS);
  }

  function finishSlideOpen(panel) {
    if (!isAnimatingOpen) return;
    isAnimatingOpen = false;
    clearSlideListener(panel);
    if (!isOpen || activePanel !== panel) return;
    scheduleFadeDismiss();
    pushPanelHistory(panel);
  }

  function syncCloseOverlay() {
    isAnimatingOpen = false;
    isOpen = false;
    activePanel = null;
    triggersLocked = false;
    for (var i = 0; i < panels.length; i++) {
      clearSlideListener(panels[i]);
      resetPanelScroll(panels[i]);
      panels[i].el.classList.remove('is-open', 'hi-panel--restore');
      panels[i].el.hidden = true;
      pausePanelVideos(panels[i]);
      clearPanelMediaAnimation(panels[i]);
    }
    disableFadeDismiss();
    if (fade) fade.classList.remove('is-visible');
    setOverlayActive(false);
    unlockScroll();
    bindTriggers();
  }

  function pushPanelHistory(panel) {
    var state = window.history.state;
    if (state && state.caseStudyPanel === panel.hash && window.location.hash === panel.hash) return;
    history.pushState({ caseStudyPanel: panel.hash }, '', basePath + panel.hash);
  }

  function revealPanel(panel) {
    disableFadeDismiss();
    resetPanelScroll(panel);
    if (fade) fade.classList.add('is-visible');
    setOverlayActive(true);
    panel.el.hidden = false;
    panel.el.classList.remove('is-open');
    isAnimatingOpen = true;
    clearSlideListener(panel);

    panel._slideEndHandler = function(ev) {
      if (ev.propertyName !== 'transform') return;
      finishSlideOpen(panel);
    };
    panel.el.addEventListener('transitionend', panel._slideEndHandler);
    panel._slideFallbackTimer = setTimeout(function() {
      finishSlideOpen(panel);
    }, SLIDE_MS);

    void panel.el.offsetWidth;
    requestAnimationFrame(function() {
      if (!isOpen || activePanel !== panel) return;
      panel.el.classList.add('is-open');
      animatePanelMedia(panel);
    });
  }

  function openPanel(panel, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (triggersLocked || isAnimatingOpen) return;

    triggersLocked = true;
    unbindAllTriggers();

    if (isOpen && activePanel && activePanel !== panel) {
      clearSlideListener(activePanel);
      activePanel.el.classList.remove('is-open');
      clearPanelMediaAnimation(activePanel);
      pausePanelVideos(activePanel);
    }

    hideOtherPanels(panel);
    isOpen = true;
    activePanel = panel;
    lockScroll();
    revealPanel(panel);
    playPanelVideos(panel);
  }

  function closePanel() {
    if (!isOpen && !isAnimatingOpen && !isOverlayVisible()) return;
    syncCloseOverlay();
  }

  function attachPanelTrigger(panel, link) {
    var gesture = null;

    function endGestureTracking() {
      gesture = null;
    }

    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      gesture = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        scrollY: window.scrollY,
        moved: false
      };
    }

    function onPointerMove(e) {
      if (!gesture || e.pointerId !== gesture.pointerId || gesture.moved) return;
      var dx = e.clientX - gesture.startX;
      var dy = e.clientY - gesture.startY;
      if (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP) {
        gesture.moved = true;
      }
    }

    function onPointerUp(e) {
      if (!gesture || e.pointerId !== gesture.pointerId) return;
      var scrolled = Math.abs(window.scrollY - gesture.scrollY) > 1;
      var shouldOpen = !gesture.moved && !scrolled;
      gesture = null;
      if (!shouldOpen) return;
      openPanel(panel, e);
    }

    function onPointerCancel(e) {
      if (!gesture || e.pointerId !== gesture.pointerId) return;
      endGestureTracking();
    }

    function onClick(e) {
      if (e.detail === 0) {
        openPanel(panel, e);
        return;
      }
      if (window.PointerEvent) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      openPanel(panel, e);
    }

    link.addEventListener('pointerdown', onPointerDown, { passive: true });
    link.addEventListener('pointermove', onPointerMove, { passive: true });
    link.addEventListener('pointerup', onPointerUp);
    link.addEventListener('pointercancel', onPointerCancel);
    link.addEventListener('click', onClick);

    return {
      link: link,
      endGestureTracking: endGestureTracking,
      handlers: [
        { type: 'pointerdown', fn: onPointerDown },
        { type: 'pointermove', fn: onPointerMove },
        { type: 'pointerup', fn: onPointerUp },
        { type: 'pointercancel', fn: onPointerCancel },
        { type: 'click', fn: onClick }
      ]
    };
  }

  function unbindAllTriggers() {
    for (var i = 0; i < triggerBindings.length; i++) {
      var binding = triggerBindings[i];
      binding.endGestureTracking();
      for (var j = 0; j < binding.handlers.length; j++) {
        var entry = binding.handlers[j];
        binding.link.removeEventListener(entry.type, entry.fn);
      }
    }
    triggerBindings = [];
  }

  function bindTriggers() {
    unbindAllTriggers();
    for (var i = 0; i < panels.length; i++) {
      (function(panel) {
        var section = document.getElementById(panel.sectionId);
        if (!section) return;
        var triggers = section.querySelectorAll('a[href="' + panel.href + '"]');
        for (var j = 0; j < triggers.length; j++) {
          triggerBindings.push(attachPanelTrigger(panel, triggers[j]));
        }
      })(panels[i]);
    }
  }

  function restorePanel(panel) {
    triggersLocked = true;
    unbindAllTriggers();
    history.replaceState(null, '', basePath);
    history.pushState({ caseStudyPanel: panel.hash }, '', basePath + panel.hash);
    isOpen = true;
    activePanel = panel;
    hideOtherPanels(panel);
    lockScroll();
    resetPanelScroll(panel);
    panel.el.hidden = false;
    panel.el.classList.add('hi-panel--restore');
    disableFadeDismiss();
    if (fade) fade.classList.add('is-visible');
    setOverlayActive(true);
    playPanelVideos(panel);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        panel.el.classList.add('is-open');
        animatePanelMedia(panel);
        scheduleFadeDismiss();
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

  document.addEventListener('pointerdown', blockPanelTriggerEvent, true);
  document.addEventListener('click', blockPanelTriggerEvent, true);

  var restorePanelMatch = getPanelByHash(window.location.hash);
  if (restorePanelMatch) {
    restorePanel(restorePanelMatch);
  } else {
    bindTriggers();
  }

  for (var i = 0; i < panels.length; i++) {
    (function(panel) {
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
    fade.addEventListener('click', function(e) {
      if (!isOverlayVisible()) return;
      if (isAnimatingOpen || !fade.classList.contains('hi-fade--dismissable')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      history.replaceState(null, '', basePath);
      syncCloseOverlay();
    });
  }

  window.addEventListener('popstate', function() {
    if (isAnimatingOpen) return;
    if (window.history.state && window.history.state.caseStudyPanel) return;
    if (isOpen || isOverlayVisible()) {
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
