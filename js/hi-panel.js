/**
 * Human Interest case study panel overlay.
 * Intercepts clicks on the Human Interest links on the homepage and opens a
 * full-screen panel that slides up from the bottom instead of navigating away.
 * Only active when #hi-panel exists (homepage only).
 */
(function() {
  var panel = document.getElementById('hi-panel');
  if (!panel) return;

  var fade = document.getElementById('hi-fade');
  var backBtn = panel.querySelector('.hi-panel-back');
  var video = panel.querySelector('video');
  var isOpen = false;

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
    // Lock the page scroll only after the slide-up finishes, so the
    // browser scrollbar stays visible throughout the opening animation.
    panel.addEventListener('transitionend', function onOpen(e) {
      if (e.propertyName !== 'transform') return;
      panel.removeEventListener('transitionend', onOpen);
      document.body.style.overflow = 'hidden';
    });
    history.pushState({ hiPanel: true }, '', 'human-interest');
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

  // Intercept both Human Interest links on the homepage
  var hiSection = document.getElementById('human-interest');
  if (hiSection) {
    var triggers = hiSection.querySelectorAll('a[href="human-interest"]');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', openPanel);
    }
  }

  // Back button uses history.back() so the popstate listener does the actual close
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      history.back();
    });
  }

  // Browser back button (and the back button above via history.back())
  window.addEventListener('popstate', function() {
    if (isOpen) closePanel();
  });

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) history.back();
  });
})();
