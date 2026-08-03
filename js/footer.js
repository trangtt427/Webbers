/**
 * Inject shared footer into #footer-placeholder. Edit this file to change footer content across all pages.
 * Index homepage uses column placeholders (social left, meta right) plus a stacked mobile footer.
 */
(function() {
  var socialHTML =
    '<a href="https://www.linkedin.com/in/trangwreck/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="footer-icon">' +
    '<img src="/assets/icons/linkedinround.svg" alt="" width="32" height="32" />' +
    '</a>' +
    '<a href="https://www.figma.com/@trangwreck/" target="_blank" rel="noopener noreferrer" aria-label="Figma" class="footer-icon">' +
    '<img src="/assets/icons/figmaround.svg" alt="" width="32" height="32" />' +
    '</a>' +
    '<a href="mailto:004tran@gmail.com" aria-label="Email" class="footer-icon">' +
    '<img src="/assets/icons/emailround.svg" alt="" width="32" height="32" />' +
    '</a>';

  var copyHTML = '<p class="site-footer-copy">© 2026 Trang Tran</p>';

  var clockHTML =
    '<div class="site-footer-clock" aria-label="Local time">' +
    '<svg class="footer-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />' +
    '</svg>' +
    '<span class="site-footer-location">SJ, CA</span>' +
    '<div class="site-footer-time">00:00:00</div>' +
    '</div>';

  var socialPh = document.getElementById('footer-social-placeholder');
  var metaPh = document.getElementById('footer-meta-placeholder');
  var stackedPh = document.getElementById('footer-placeholder');

  if (socialPh && metaPh) {
    socialPh.innerHTML =
      '<div class="site-footer-social" aria-label="Social links">' + socialHTML + '</div>';
    metaPh.innerHTML =
      '<div class="site-footer-meta">' + copyHTML + clockHTML + '</div>';
    if (stackedPh && stackedPh.getAttribute('data-footer-layout') === 'stacked') {
      stackedPh.innerHTML =
        '<footer class="site-footer site-footer--stacked">' +
        '<div class="site-footer-inner">' +
        '<div class="site-footer-social" aria-label="Social links">' + socialHTML + '</div>' +
        '<div class="site-footer-meta">' + copyHTML + clockHTML + '</div>' +
        '</div>' +
        '</footer>';
    }
    return;
  }

  if (!stackedPh) return;

  stackedPh.innerHTML =
    '<footer class="site-footer">' +
    '<div class="site-footer-inner">' +
    '<div class="site-footer-social" aria-label="Social links">' + socialHTML + '</div>' +
    '<div class="site-footer-meta">' + copyHTML + clockHTML + '</div>' +
    '</div>' +
    '</footer>';
})();
