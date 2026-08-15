/**
 * Homepage media rail: the rail owns all scrolling on desktop. Wheel input feeds
 * a target that the rail eases toward, and the case studies are repeated so
 * scrolling past the last one rolls into the first.
 */
(function() {
  var layout = document.querySelector('.homepage-layout:not(.homepage-layout--work)');
  var rail = document.querySelector('.homepage-media-rail');
  if (!layout || !rail) return;

  var DESKTOP_MQ = window.matchMedia('(min-width: 1001px)');
  var originalItems = Array.prototype.slice.call(rail.querySelectorAll('.homepage-media-item'));
  if (!originalItems.length) return;

  var FOCUS_RATIO = 0.35;
  // Fraction of the remaining distance covered each frame. Decelerating toward
  // the target eases out smoothly and never overshoots it.
  var EASE = 0.075;

  var mediaItems = originalItems;
  var sets = 1;
  var baseHeight = 0;
  var wheelBound = false;
  var lastActiveId = '';

  var currentTop = 0;
  var targetTop = 0;
  var animating = false;

  function appendSet() {
    for (var i = 0; i < originalItems.length; i++) {
      var clone = originalItems[i].cloneNode(true);
      clone.classList.add('homepage-media-item--clone');
      clone.setAttribute('aria-hidden', 'true');
      var links = clone.querySelectorAll('a');
      for (var l = 0; l < links.length; l++) links[l].setAttribute('tabindex', '-1');
      rail.appendChild(clone);
    }
    sets++;
    mediaItems = Array.prototype.slice.call(rail.querySelectorAll('.homepage-media-item'));
  }

  function measureBase() {
    if (mediaItems.length <= originalItems.length) return 0;
    // offsetTop rounds to whole pixels; the items are fractionally tall, so a
    // rounded period would leave a visible seam at every re-anchor.
    var first = mediaItems[0].getBoundingClientRect().top;
    var next = mediaItems[originalItems.length].getBoundingClientRect().top;
    return next - first;
  }

  function headerClearance() {
    var header = document.querySelector('.site-header');
    var height = header ? header.getBoundingClientRect().height : 0;
    return height > 0 ? height : 60;
  }

  function scrollTopForItem(item) {
    return item.offsetTop - headerClearance();
  }

  // Land on the first case study with its top edge just below the header. Prefer a
  // middle loop set so there's a full period of travel in both directions
  // before re-anchoring — otherwise the wrap fires mid-carousel (around
  // Squarespace → Tactic) and any subpixel period drift reads as a jump.
  function resetInitialScroll() {
    if (!DESKTOP_MQ.matches) return;
    var setIndex = sets >= 3 ? 2 : (sets > 1 ? 1 : 0);
    var landing = mediaItems[setIndex * originalItems.length];
    if (!landing) return;
    currentTop = targetTop = scrollTopForItem(landing);
    rail.scrollTop = currentTop;
    var id = landing.getAttribute('data-work-id');
    lastActiveId = id;
    setActiveMedia(id);
    window.dispatchEvent(new CustomEvent('homepage-rail-active', { detail: { id: id } }));
  }

  function buildLoop() {
    if (sets > 1) return;
    appendSet();
    baseHeight = measureBase();
    // Need ≥4 sets so the safe window can span a full period of travel
    // without running into the native scroll limits.
    while (sets < 4 && baseHeight > 0) {
      appendSet();
    }
    resetInitialScroll();
  }

  function anchor() {
    if (sets < 3 || baseHeight <= 0) return;
    // Keep scroll in [baseHeight, (sets - 1) * baseHeight): one full set of
    // headroom above and below the starting middle set. The old [0.5, 1.5)
    // window re-anchored after ~2 items — right as Squarespace slipped behind
    // the header — so any subpixel period drift read as a visible jump.
    var low = baseHeight;
    var high = baseHeight * (sets - 1);
    var shift = 0;
    while (currentTop + shift >= high) shift -= baseHeight;
    while (currentTop + shift < low) shift += baseHeight;
    if (shift === 0) return;
    // The list repeats, so this lands on visually identical content. Shifting
    // both ends keeps the in-flight animation intact.
    currentTop += shift;
    targetTop += shift;
  }

  function clampTarget() {
    if (sets >= 2 && baseHeight > 0) return;
    var maxTop = rail.scrollHeight - rail.clientHeight;
    if (targetTop < 0) targetTop = 0;
    if (targetTop > maxTop) targetTop = maxTop;
  }

  function step() {
    var distance = targetTop - currentTop;
    currentTop += distance * EASE;

    var settled = Math.abs(distance) < 0.12;
    if (settled) {
      currentTop = targetTop;
    }

    anchor();
    rail.scrollTop = currentTop;
    syncFromRail();

    if (settled) {
      animating = false;
      return;
    }
    requestAnimationFrame(step);
  }

  function startAnimation() {
    if (animating) return;
    animating = true;
    requestAnimationFrame(step);
  }

  function setActiveMedia(id) {
    for (var i = 0; i < mediaItems.length; i++) {
      var item = mediaItems[i];
      var match = id && item.getAttribute('data-work-id') === id;
      item.classList.toggle('homepage-media-item--active', !!match);
    }
  }

  function scrollRailTo(id, instant) {
    if (!DESKTOP_MQ.matches || !id) return;
    var target = null;
    var best = Infinity;
    for (var i = 0; i < mediaItems.length; i++) {
      var item = mediaItems[i];
      if (item.getAttribute('data-work-id') !== id) continue;
      var top = scrollTopForItem(item);
      var distance = Math.abs(top - currentTop);
      if (distance < best) {
        best = distance;
        target = top;
      }
    }
    if (target === null) return;
    targetTop = target;
    clampTarget();
    if (instant) {
      currentTop = targetTop;
      anchor();
      rail.scrollTop = currentTop;
      syncFromRail();
      return;
    }
    startAnimation();
  }

  function activeIdFromRail() {
    if (!mediaItems.length) return '';
    var focus = rail.scrollTop + rail.clientHeight * FOCUS_RATIO;
    var activeId = '';
    var best = Infinity;
    for (var i = 0; i < mediaItems.length; i++) {
      var item = mediaItems[i];
      var distance = Math.abs(item.offsetTop + item.offsetHeight / 2 - focus);
      if (distance < best) {
        best = distance;
        activeId = item.getAttribute('data-work-id');
      }
    }
    return activeId;
  }

  function syncFromRail() {
    if (!DESKTOP_MQ.matches) return;
    var activeId = activeIdFromRail();
    setActiveMedia(activeId);
    if (activeId !== lastActiveId) {
      lastActiveId = activeId;
      window.dispatchEvent(new CustomEvent('homepage-rail-active', { detail: { id: activeId } }));
    }
  }

  function onWheel(e) {
    if (!DESKTOP_MQ.matches) return;
    if (e.target.closest('.hi-panel')) return;
    e.preventDefault();
    targetTop += e.deltaY;
    clampTarget();
    startAnimation();
  }

  function setRailScrollMode(on) {
    document.documentElement.classList.toggle('homepage-rail-scroll', on);
    if (on && !wheelBound) {
      window.addEventListener('wheel', onWheel, { passive: false });
      wheelBound = true;
    } else if (!on && wheelBound) {
      window.removeEventListener('wheel', onWheel);
      wheelBound = false;
    }
  }

  function updateMode() {
    var on = DESKTOP_MQ.matches;
    var wasOn = document.documentElement.classList.contains('homepage-rail-scroll');
    setRailScrollMode(on);
    if (on) {
      buildLoop();
      if (!wasOn) {
        window.scrollTo(0, 0);
        baseHeight = measureBase();
        resetInitialScroll();
      }
      requestAnimationFrame(syncFromRail);
    } else {
      animating = false;
      lastActiveId = '';
    }
  }

  window.addEventListener('homepage-media-active', function(e) {
    var id = e.detail && e.detail.id;
    setActiveMedia(id);
    scrollRailTo(id, !!(e.detail && e.detail.instant));
    if (id !== lastActiveId) {
      lastActiveId = id || '';
      window.dispatchEvent(new CustomEvent('homepage-rail-active', { detail: { id: id || '' } }));
    }
  });

  rail.addEventListener('scroll', function() {
    if (!DESKTOP_MQ.matches || animating) return;
    // Something outside the animation moved the rail (touch, keyboard); resync.
    currentTop = targetTop = rail.scrollTop;
    syncFromRail();
  }, { passive: true });

  window.addEventListener('resize', function() {
    if (!DESKTOP_MQ.matches || sets < 2) return;
    baseHeight = measureBase();
  });

  if (typeof DESKTOP_MQ.addEventListener === 'function') {
    DESKTOP_MQ.addEventListener('change', updateMode);
  } else if (typeof DESKTOP_MQ.addListener === 'function') {
    DESKTOP_MQ.addListener(updateMode);
  }

  updateMode();
  requestAnimationFrame(syncFromRail);
})();
