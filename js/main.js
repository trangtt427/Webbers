/**
 * Shared site behavior: clock, theme toggle, hamburger menu, header hide-on-scroll.
 * Safe to load on every page; each block checks for required elements.
 */

(function() {
  // Preserve scroll position on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }
})();

(function() {
  // Hero entrance animation on homepage: starts right away, moves up from farther, longer animation
  var hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        hero.classList.add('hero-in');
      });
    });
  }
})();

(function() {
  // Case study page hero + details: same fade-in + move-up as index hero, both at once
  var caseStudyIntro = document.querySelector('.case-study-intro');
  var caseStudyDetails = document.querySelector('.case-study-details');
  if (caseStudyIntro || caseStudyDetails) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        if (caseStudyIntro) caseStudyIntro.classList.add('case-study-intro-in');
        if (caseStudyDetails) caseStudyDetails.classList.add('case-study-details-in');
      });
    });
  }
})();

(function() {
  // About page: two-col section move-in from left when scrolled into view (same trigger as project cards)
  var aboutTwoCol = document.querySelector('.about-two-col');
  if (!aboutTwoCol || !('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function() {
            el.classList.add('about-two-col-in');
          }, 100);
        }
      });
    },
    { rootMargin: '0px 0px 20px 0px', threshold: 0 }
  );
  observer.observe(aboutTwoCol);
})();

(function() {
  // Case studies animate 0.1s after scrolling to their positions
  var projects = document.querySelectorAll('.project');
  if (!projects.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function() {
            el.classList.add('project-in-view');
          }, 100);
        }
      });
    },
    { rootMargin: '0px 0px 20px 0px', threshold: 0 }
  );
  projects.forEach(function(project) { observer.observe(project); });
})();

(function() {
  // Case study page: images fade in and move up on scroll (like index case studies)
  var images = document.querySelectorAll('.case-study .case-study-image-wrap');
  if (!images.length || !('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var figure = el.closest && el.closest('figure');
          var hasCaption = figure && (figure.querySelector('figcaption') || figure.querySelector('.case-study-caption'));
          var animateFigure = figure && (hasCaption || figure.classList.contains('case-study-figure-caption') || figure.classList.contains('case-study-two-col-image'));
          var target = animateFigure ? figure : el;
          setTimeout(function() {
            target.classList.add('case-study-image-in-view');
          }, 100);
        }
      });
    },
    { rootMargin: '0px 0px 20px 0px', threshold: 0 }
  );
  images.forEach(function(img) { observer.observe(img); });
})();

(function() {
  // Live clock
  function updateClock() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    var el = document.getElementById('clock');
    if (el) el.textContent = h + ':' + m + ':' + s;
  }
  updateClock();
  setInterval(updateClock, 1000);
})();

(function() {
  // Theme switcher (light / dark) – class on html so head script can run before first paint
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.classList.add('dark');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      root.classList.remove('dark');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  var stored = null;
  try {
    stored = window.localStorage && localStorage.getItem('theme');
  } catch (e) {}

  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  toggle.addEventListener('click', function() {
    var next = root.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    try {
      window.localStorage && localStorage.setItem('theme', next);
    } catch (e) {}
  });
})();

(function() {
  // Hamburger menu: at 768px use full-screen overlay; desktop uses dropdown
  var btn = document.getElementById('hamburger-btn');
  var dropdown = document.getElementById('site-nav-dropdown');
  if (!btn || !dropdown) return;

  var overlay = null;

  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('is-open');
    document.body.classList.remove('mobile-menu-open');
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
      overlay = null;
    }
  }

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-open');
    if (window.innerWidth <= 768) {
      overlay = document.createElement('div');
      overlay.id = 'mobile-menu-overlay';
      overlay.className = 'mobile-menu-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Menu');
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'mobile-menu-close';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '<span class="line"></span><span class="line"></span><span class="line"></span>';
      closeBtn.addEventListener('click', closeMenu);
      overlay.appendChild(closeBtn);
      var linksWrap = document.createElement('div');
      linksWrap.className = 'mobile-menu-links';
      var links = dropdown.querySelectorAll('a');
      links.forEach(function(a) {
        var link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = a.textContent;
        if (a.classList.contains('nav-active')) link.classList.add('nav-active');
        link.addEventListener('click', function() { closeMenu(); });
        linksWrap.appendChild(link);
      });
      overlay.appendChild(linksWrap);
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeMenu();
      });
      document.body.appendChild(overlay);
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          if (overlay && overlay.parentNode) overlay.classList.add('is-visible');
        });
      });
    } else {
      dropdown.classList.add('is-open');
    }
  }

  btn.addEventListener('click', function() {
    if (btn.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  dropdown.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() { closeMenu(); });
  });

  document.addEventListener('click', function(e) {
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    if (overlay && !btn.contains(e.target) && !overlay.contains(e.target)) closeMenu();
    if (!overlay && !btn.contains(e.target) && !dropdown.contains(e.target)) closeMenu();
  });
})();

(function() {
  // Header hides on scroll down, reappears on scroll up (desktop only; on mobile it causes jumpiness)
  var header = document.querySelector('.site-header');
  if (!header) return;

  var lastY = window.scrollY || 0;
  var hidden = false;
  var ticking = false;

  function isMobile() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  }

  function update() {
    if (isMobile()) {
      if (hidden) header.classList.remove('header-hidden');
      hidden = false;
      lastY = window.scrollY || 0;
      return;
    }

    var y = window.scrollY || 0;
    var dy = y - lastY;

    if (y <= 24) {
      if (hidden) header.classList.remove('header-hidden');
      hidden = false;
      lastY = y;
      return;
    }

    if (dy < 0 && hidden) {
      header.classList.remove('header-hidden');
      hidden = false;
      lastY = y;
      return;
    }

    if (Math.abs(dy) < 8) {
      lastY = y;
      return;
    }

    if (dy > 0 && y > 96 && !hidden) {
      header.classList.add('header-hidden');
      hidden = true;
    }

    lastY = y;
  }

  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function() {
      update();
      ticking = false;
    });
  }, { passive: true });

  // When resizing from mobile to desktop, ensure header state is correct
  window.addEventListener('resize', function() {
    if (!isMobile() && hidden) return;
    if (isMobile() && hidden) {
      header.classList.remove('header-hidden');
      hidden = false;
    }
    lastY = window.scrollY || 0;
  });
})();

(function() {
  // Lightbox: click image to open full-size overlay
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var overlay = lightbox.querySelector('.lightbox-overlay');
  var content = lightbox.querySelector('.lightbox-content');
  var img = lightbox.querySelector('.lightbox-image');
  var videoEl = lightbox.querySelector('.lightbox-video');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var captionEl = lightbox.querySelector('.lightbox-caption');

  function isVideoSrc(src) {
    return /\.(mp4|webm|ogg)(\?|$)/i.test(src || '');
  }

  function openLightbox(src, alt, caption) {
    var showVideo = isVideoSrc(src);
    if (showVideo && videoEl) {
      videoEl.innerHTML = '<source src="' + src.replace(/"/g, '&quot;') + '" type="video/mp4" />';
      videoEl.classList.add('is-visible');
      if (img) img.style.display = 'none';
      videoEl.play().catch(function() {});
    } else if (img) {
      img.src = src;
      img.alt = alt || '';
      img.style.display = '';
      if (videoEl) {
        videoEl.innerHTML = '';
        videoEl.classList.remove('is-visible');
        videoEl.pause();
      }
    }
    if (captionEl) {
      captionEl.textContent = caption || '';
    }
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        lightbox.classList.add('is-visible');
      });
    });
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-visible');
    function hideAfterTransition(e) {
      if (e.target !== lightbox || e.propertyName !== 'opacity') return;
      lightbox.removeEventListener('transitionend', hideAfterTransition);
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (img) {
        img.removeAttribute('src');
        img.style.display = '';
      }
      if (videoEl) {
        videoEl.pause();
        videoEl.innerHTML = '';
        videoEl.classList.remove('is-visible');
      }
      if (captionEl) captionEl.textContent = '';
    }
    lightbox.addEventListener('transitionend', hideAfterTransition);
  }

  function getCaptionForWrap(wrap) {
    var figure = wrap.closest('figure');
    if (!figure) return '';
    var cap = figure.querySelector('figcaption, .case-study-caption');
    return cap ? cap.textContent.trim() : '';
  }

  function getMediaSrcAndAlt(wrap) {
    var im = wrap.querySelector('img');
    if (im) return { src: im.src, alt: im.alt };
    var source = wrap.querySelector('video source');
    if (source) return { src: source.getAttribute('src') || '', alt: '' };
    return null;
  }

  document.querySelectorAll('.case-study-image-wrap.lightbox-openable').forEach(function(wrap) {
    wrap.addEventListener('click', function(e) {
      if (e.target === closeBtn) return;
      var media = getMediaSrcAndAlt(wrap);
      if (media && media.src) {
        e.preventDefault();
        openLightbox(media.src, media.alt, getCaptionForWrap(wrap));
      }
    });
    wrap.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var media = getMediaSrcAndAlt(wrap);
        if (media && media.src) openLightbox(media.src, media.alt, getCaptionForWrap(wrap));
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (overlay) overlay.addEventListener('click', closeLightbox);
  lightbox.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });
})();
