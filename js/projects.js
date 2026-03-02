/**
 * Projects page: hide .no-video fallback when a project video loads.
 * Show a clearer message when the video fails to load.
 */
(function() {
  var ERROR_MSG = 'Video failed to load. Try refreshing the page or viewing in a different browser.';
  function markReady(wrap) {
    if (wrap) wrap.classList.add('video-ready');
  }
  function showError(wrap) {
    if (!wrap) return;
    wrap.classList.remove('video-ready');
    wrap.classList.add('video-error');
    var fallback = wrap.querySelector('.no-video');
    if (fallback) fallback.textContent = ERROR_MSG;
  }
  document.querySelectorAll('.project-video-wrap video').forEach(function(v) {
    var wrap = v.closest('.project-video-wrap');
    if (!wrap) return;
    v.addEventListener('loadeddata', function() { markReady(wrap); });
    v.addEventListener('loadedmetadata', function() { markReady(wrap); });
    v.addEventListener('canplay', function() { markReady(wrap); });
    v.addEventListener('error', function() { showError(wrap); });
    if (v.readyState >= 1) {
      markReady(wrap);
    } else if (v.error) {
      showError(wrap);
    }
  });
})();
