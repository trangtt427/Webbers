/**
 * Projects page: hide .no-video fallback when a project video loads.
 * Load this only on pages that have .project-video-wrap video elements.
 */
(function() {
  document.querySelectorAll('.project-video-wrap video').forEach(function(v) {
    var wrap = v.closest('.project-video-wrap');
    if (!wrap) return;
    v.addEventListener('loadeddata', function() { wrap.classList.add('video-ready'); });
    v.addEventListener('error', function() { wrap.classList.remove('video-ready'); });
  });
})();
