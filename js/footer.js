/**
 * Inject shared footer into #footer-placeholder. Edit this file to change footer content across all pages.
 */
(function() {
  var placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;

  var footerHTML =
    '<footer class="site-footer">' +
    '<div class="site-footer-main">' +
    '<p class="site-footer-copy site-footer-copy--first">© 2026 Trang Tran</p>' +
    '<p class="site-footer-copy"><span class="footer-strikethrough">Built from scratch with my atrocious code</span></p>' +
    '<p class="site-footer-tagline">Rebuilt with AI to look like the original ♥</p>' +
    '<div class="site-footer-social" aria-label="Social links">' +
    '<a href="https://www.linkedin.com/in/trangwreck/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="footer-icon">' +
    '<img src="assets/icons/linkedinround.svg" alt="" width="40" height="40" />' +
    '</a>' +
    '<a href="https://www.figma.com/@trangwreck" target="_blank" rel="noopener noreferrer" aria-label="Figma" class="footer-icon">' +
    '<img src="assets/icons/figmaround.svg" alt="" width="40" height="40" />' +
    '</a>' +
    '<a href="https://www.youtube.com/@trvngwreck" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="footer-icon">' +
    '<img src="assets/icons/youtuberound.svg" alt="" width="40" height="40" />' +
    '</a>' +
    '<a href="mailto:004tran@gmail.com" aria-label="Email" class="footer-icon">' +
    '<img src="assets/icons/emailround.svg" alt="" width="40" height="40" />' +
    '</a>' +
    '</div>' +
    '</div>' +
    '<div class="site-footer-clock" aria-label="Local time">' +
    '<svg class="footer-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />' +
    '</svg>' +
    '<span class="site-footer-location">SJ, CA</span>' +
    '<div class="site-footer-time" id="clock">00:00:00</div>' +
    '</div>' +
    '</footer>';

  placeholder.innerHTML = footerHTML;
})();
