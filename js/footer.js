/**
 * Inject shared footer into #footer-placeholder. Edit this file to change footer content across all pages.
 * Index homepage uses a meta column placeholder plus a stacked mobile footer, and omits the social links.
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
    '<span class="site-footer-location">SJ, CA</span>' +
    '<div class="site-footer-time">00:00:00</div>' +
    '</div>';

  var metaPh = document.getElementById('footer-meta-placeholder');
  var stackedPh = document.getElementById('footer-placeholder');

  // Homepage: meta only, in the right-hand column and in the stacked mobile footer.
  if (metaPh) {
    metaPh.innerHTML =
      '<div class="site-footer-meta">' + copyHTML + clockHTML + '</div>';
    if (stackedPh && stackedPh.getAttribute('data-footer-layout') === 'stacked') {
      stackedPh.innerHTML =
        '<footer class="site-footer site-footer--stacked">' +
        '<div class="site-footer-inner">' +
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
