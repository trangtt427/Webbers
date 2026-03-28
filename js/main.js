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
  var homepageIntro = document.querySelector('.homepage-intro');
  var target = hero || homepageIntro;
  if (target) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        if (hero) hero.classList.add('hero-in');
        if (homepageIntro) homepageIntro.classList.add('homepage-intro-in');
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
  // About page hero: animate from left on load (same as index hero, case study intro)
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
  // About "Currently" block (homepage + about page): same fade + slide as about-two-col
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
  // Case studies / homepage case studies animate 0.1s after scrolling to their positions
  var projects = document.querySelectorAll('.project');
  var homepageCaseStudies = document.querySelectorAll('.homepage-case-study');
  var targets = projects.length ? projects : homepageCaseStudies;
  if (!targets.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function() {
            el.classList.add(projects.length ? 'project-in-view' : 'homepage-case-study-in-view');
          }, 100);
        }
      });
    },
    { rootMargin: '0px 0px 20px 0px', threshold: 0 }
  );
  for (var i = 0; i < targets.length; i++) observer.observe(targets[i]);
})();

(function() {
  // Homepage TOC scroll-spy: highlight active section as user scrolls
  var toc = document.querySelector('.homepage-toc');
  if (!toc || !('IntersectionObserver' in window)) return;

  var sectionIds = ['intro', 'acuity-enterprise', 'squarespace', 'human-interest', 'tactic', 'baby-design-ui', 'about'];
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
