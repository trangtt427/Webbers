/**
 * Shared site behavior: clock, theme toggle, hamburger menu, header hide-on-scroll.
 * Safe to load on every page; each block checks for required elements.
 */

(function() {
  // On the homepage, always start at the top on refresh so the entrance animation plays from
  // the top. Other pages keep the browser's default scroll restoration.
  var isHomepage = !!document.querySelector('.homepage-layout');
  if ('scrollRestoration' in history) {
    history.scrollRestoration = isHomepage ? 'manual' : 'auto';
  }
  // Start at the top on a plain homepage load, and also when restoring the
  // Case study panels (their hashes aren't scroll targets).
  if (isHomepage && (!window.location.hash || window.location.hash === '#/tactic' || window.location.hash === '#/baby-design')) {
    window.scrollTo(0, 0);
  }
})();

(function() {
  // Hero entrance animation on homepage: starts right away, moves up from farther, longer animation.
  // On the homepage, the wordmark and the nav/theme/TOC group then animate in as staged follow-ups.
  var homepageLayout = document.querySelector('.homepage-layout');
  var hero = document.querySelector('.hero');
  var homepageIntro = document.querySelector('.homepage-intro');

  // Stage 1: hero in immediately (all pages with a hero/intro).
  // Skip during panel restore — homepage elements must stay invisible until
  // the panel finishes its fade-in (see _revealHomepage below).
  if (hero || homepageIntro) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        if (document.documentElement.classList.contains('hi-panel-restoring')) return;
        if (hero) hero.classList.add('hero-in');
        if (homepageIntro) homepageIntro.classList.add('homepage-intro-in');
      });
    });
  }

  if (!homepageLayout) return; // header/TOC staging is homepage-only

  var siteName = document.querySelector('.site-header .site-name');
  var siteMeta = document.querySelector('.site-header .site-meta');
  var toc = document.querySelector('.homepage-toc');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveals everything below the hero together: case studies, the about section (divider,
  // intro, baby picture + second body of text, and the "Currently" block), and the footer.
  function revealBelowHero() {
    if (homepageIntro) homepageIntro.classList.add('homepage-intro-divider-in');
    var caseStudies = document.querySelectorAll('.homepage-case-study');
    for (var i = 0; i < caseStudies.length; i++) {
      caseStudies[i].classList.add('homepage-case-study-in-view');
    }
    var aboutSection = document.querySelector('.homepage-about');
    if (aboutSection) aboutSection.classList.add('homepage-about-divider-in');
    var aboutHero = document.querySelector('.about-hero-content');
    if (aboutHero) aboutHero.classList.add('about-hero-content-in');
    var aboutTimeline = document.querySelector('.about-timeline');
    if (aboutTimeline) aboutTimeline.classList.add('about-timeline-in');
    var aboutTwoCol = document.querySelector('.about-two-col');
    if (aboutTwoCol) aboutTwoCol.classList.add('about-two-col-in');
    var aboutCurrently = document.querySelector('.about-currently');
    if (aboutCurrently) aboutCurrently.classList.add('about-currently-in');
    var footer = document.querySelector('.site-footer');
    if (footer) footer.classList.add('site-footer-in');
  }

  if (reduced) {
    if (siteName) siteName.classList.add('site-name-in');
    if (siteMeta) siteMeta.classList.add('site-meta-in');
    if (toc) toc.classList.add('homepage-toc-in');
    revealBelowHero();
    return;
  }

  // Panel restore: expose a function that hi-panel.js calls once the panel
  // finishes its fade-in. All classes are applied while hi-panel-restoring is
  // still on <html> (transition: none), so everything snaps instantly with no
  // visible flash. The homepage is then ready for when the user closes the panel.
  if (document.documentElement.classList.contains('hi-panel-restoring')) {
    window._revealHomepage = function() {
      if (homepageIntro) homepageIntro.classList.add('homepage-intro-in');
      if (siteName) siteName.classList.add('site-name-in');
      if (siteMeta) siteMeta.classList.add('site-meta-in');
      if (toc) toc.classList.add('homepage-toc-in');
      revealBelowHero();
    };
    return;
  }

  // Stage 2: wordmark after hero
  setTimeout(function() {
    if (siteName) siteName.classList.add('site-name-in');
  }, 1000);

  // Stage 3: nav links + theme switcher + TOC + everything below the hero
  setTimeout(function() {
    if (siteMeta) siteMeta.classList.add('site-meta-in');
    if (toc) toc.classList.add('homepage-toc-in');
    revealBelowHero();
  }, 2300);
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
  // Blog index: each post row uses the same fade + slide-in as case-study-intro, staggered
  var blogItems = document.querySelectorAll('.blog-index .blog-index-item');
  if (!blogItems.length) return;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    for (var r = 0; r < blogItems.length; r++) {
      blogItems[r].classList.add('blog-index-item-in');
    }
    return;
  }
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      for (var i = 0; i < blogItems.length; i++) {
        (function(index) {
          setTimeout(function() {
            blogItems[index].classList.add('blog-index-item-in');
          }, index * 90);
        })(i);
      }
    });
  });
})();

(function() {
  // About page hero: fade up on load. (On the homepage, the about section is part of the
  // Stage 3 entrance instead, so skip it here.)
  if (document.querySelector('.homepage-layout')) return;
  var aboutHeroContent = document.querySelector('.about-hero-content');
  if (aboutHeroContent) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        aboutHeroContent.classList.add('about-hero-content-in');
      });
    });
  }
})();

(function() {
  // About page: two-col section fades up when scrolled into view (same trigger as project cards).
  // On the homepage it's revealed together in Stage 3, so skip the scroll trigger there.
  if (document.querySelector('.homepage-layout')) return;
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
  // About "Currently" block (about page): same fade up as about-two-col.
  // On the homepage it's revealed together in Stage 3, so skip the scroll trigger there.
  if (document.querySelector('.homepage-layout')) return;
  var aboutCurrently = document.querySelector('.about-currently');
  if (!aboutCurrently || !('IntersectionObserver' in window)) return;
  var observerCurrently = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function() {
            el.classList.add('about-currently-in');
          }, 100);
        }
      });
    },
    { rootMargin: '0px 0px 20px 0px', threshold: 0 }
  );
  observerCurrently.observe(aboutCurrently);
})();

(function() {
  // Case study pages: projects animate 0.1s after scrolling to their positions.
  // (Homepage case studies are revealed together in the Stage 3 entrance, not on scroll.)
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
  for (var i = 0; i < projects.length; i++) observer.observe(projects[i]);
})();

(function() {
  // Homepage TOC scroll-spy: highlight active section as user scrolls
  var toc = document.querySelector('.homepage-toc');
  if (!toc || !('IntersectionObserver' in window)) return;

  var sectionIds = ['intro', 'squarespace', 'human-interest', 'tactic', 'baby-design-ui', 'about'];
  var sections = [];
  for (var i = 0; i < sectionIds.length; i++) {
    var el = document.getElementById(sectionIds[i]);
    if (el) sections.push(el);
  }
  var tocLinks = toc.querySelectorAll('.homepage-toc-link');
  var dividers = toc.querySelectorAll('.homepage-toc-divider');

  function setDividerWidths() {
    if (dividers.length === 0) return;
    var maxW = 0;
    for (var d = 0; d < tocLinks.length; d++) {
      var link = tocLinks[d];
      var range = document.createRange();
      range.selectNodeContents(link);
      var w = range.getBoundingClientRect().width;
      range.detach();
      if (w > maxW) maxW = w;
    }
    if (maxW > 0) {
      for (var i = 0; i < dividers.length; i++) {
        dividers[i].style.width = maxW + 'px';
      }
    }
  }
  setDividerWidths();
  window.addEventListener('resize', setDividerWidths);

  function setActive(id) {
    for (var j = 0; j < tocLinks.length; j++) {
      var link = tocLinks[j];
      if ((link.getAttribute('href') || '').replace('#', '') === id) {
        link.classList.add('toc-active');
      } else {
        link.classList.remove('toc-active');
      }
    }
  }

  function updateActive() {
    var vh = window.innerHeight;
    var activeId = null;
    var minTop = Infinity;

    for (var k = 0; k < sections.length; k++) {
      var rect = sections[k].getBoundingClientRect();
      if (rect.top <= vh * 0.35 && rect.bottom > 0) {
        if (rect.top < minTop) {
          minTop = rect.top;
          activeId = sections[k].id;
        }
      }
    }
    if (!activeId && sections.length) {
      var topmost = null;
      var topmostTop = Infinity;
      for (var n = 0; n < sections.length; n++) {
        var r = sections[n].getBoundingClientRect();
        if (r.top >= 0 && r.top < topmostTop) {
          topmostTop = r.top;
          topmost = sections[n].id;
        } else if (r.top < 0 && r.bottom > 0) {
          topmost = sections[n].id;
          break;
        }
      }
      activeId = topmost || sections[0].id;
    }
    if (activeId) setActive(activeId);
  }

  var observer = new IntersectionObserver(
    function() { updateActive(); },
    { rootMargin: '-20% 0px -50% 0px', threshold: 0 }
  );
  for (var m = 0; m < sections.length; m++) observer.observe(sections[m]);
  updateActive();

  var scrollTicking = false;
  window.addEventListener('scroll', function() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function() {
      updateActive();
      scrollTicking = false;
    });
  }, { passive: true });
})();

(function() {
  // Case study hero media (first image/video after intro): animate on load, same as intro
  var heroMedia = document.querySelector('.case-study-hero-media');
  if (heroMedia) {
    setTimeout(function() {
      heroMedia.classList.add('case-study-image-in-view');
    }, 150);
  }
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
  var toggles = document.querySelectorAll('.theme-toggle');
  if (!toggles.length) return;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.classList.add('dark');
      toggles.forEach(function(t) {
        t.setAttribute('aria-pressed', 'true');
        t.setAttribute('aria-label', 'Switch to light mode');
      });
    } else {
      root.classList.remove('dark');
      toggles.forEach(function(t) {
        t.setAttribute('aria-pressed', 'false');
        t.setAttribute('aria-label', 'Switch to dark mode');
      });
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

  toggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var next = root.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      try {
        window.localStorage && localStorage.setItem('theme', next);
      } catch (e) {}
    });
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
  // Hide on scroll down only after this offset; show on scroll up or near top (desktop only)
  var NAV_HIDE_AFTER_PX = 96;
  var TOP_ALWAYS_SHOW_PX = 24;

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

    if (y <= TOP_ALWAYS_SHOW_PX) {
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

    if (dy > 0 && y > NAV_HIDE_AFTER_PX && !hidden) {
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

  window.addEventListener('resize', function() {
    if (isMobile() && hidden) {
      header.classList.remove('header-hidden');
      hidden = false;
    }
    lastY = window.scrollY || 0;
  });

  update();
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
