/**
 * Inject shared footer into #footer-placeholder. Edit this file to change footer content across all pages.
 * Also injects floating logo for mobile.
 */
(function() {
  // Floating logo for mobile (replaces header)
  var floatingLogo = document.createElement('a');
  floatingLogo.href = 'https://www.trangtran.design/';
  floatingLogo.className = 'floating-logo';
  floatingLogo.setAttribute('aria-label', 'Trang Tran');
  floatingLogo.innerHTML = '<img src="simple.svg" alt="" width="36" height="34" />';
  document.body.insertBefore(floatingLogo, document.body.firstChild);

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
    '<div class="site-footer-right">' +
    '<div class="site-footer-clock" aria-label="Local time">' +
    '<svg class="footer-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />' +
    '</svg>' +
    '<span class="site-footer-location">SJ, CA</span>' +
    '<div class="site-footer-time" id="clock">00:00:00</div>' +
    '</div>' +
    '<button class="theme-toggle theme-toggle-footer" type="button" aria-label="Toggle theme" aria-pressed="false">' +
    '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 13.2A8.4 8.4 0 1 1 10.8 3a6.8 6.8 0 0 0 10.2 10.2Z" /></svg>' +
    '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="3.5" /><line x1="12" y1="2.5" x2="12" y2="5.2" /><line x1="12" y1="18.8" x2="12" y2="21.5" />' +
    '<line x1="2.5" y1="12" x2="5.2" y2="12" /><line x1="18.8" y1="12" x2="21.5" y2="12" />' +
    '<line x1="4.4" y1="4.4" x2="6.3" y2="6.3" /><line x1="17.7" y1="17.7" x2="19.6" y2="19.6" />' +
    '<line x1="17.7" y1="6.3" x2="19.6" y2="4.4" /><line x1="4.4" y1="19.6" x2="6.3" y2="17.7" />' +
    '</svg></button>' +
    '</div>' +
    '</footer>';

  placeholder.innerHTML = footerHTML;
})();
