/**
 * Shared site behavior: clock, theme toggle, hamburger menu, header hide-on-scroll.
 * Safe to load on every page; each block checks for required elements.
 */

(function() {
  window.playHomepageMediaRailVideos = function() {
    if (document.documentElement.classList.contains('home-intro-active')) return;
    var videos = document.querySelectorAll('.homepage-layout:not(.homepage-layout--work) .homepage-media-rail video');
    for (var i = 0; i < videos.length; i++) {
      videos[i].play().catch(function() {});
    }
  };
})();

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
  // On the homepage, the wordmark and the nav/theme group then animate in as staged follow-ups.
  var homepageLayout = document.querySelector('.homepage-layout');
  var hero = document.querySelector('.hero');
  var homepageIntro = document.querySelector('.homepage-intro');
  var siteName = document.querySelector('.site-header .site-name');
  var siteMeta = document.querySelector('.site-header .site-meta');
  var mediaRail = document.querySelector('.homepage-layout:not(.homepage-layout--work) .homepage-media-rail');
  var isWorkPage = homepageLayout && homepageLayout.classList.contains('homepage-layout--work');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var introSeen = false;
  try {
    introSeen = !!(window.sessionStorage && sessionStorage.getItem('home-intro-seen'));
  } catch (e) {}

  function unlockHomepageEntranceScroll() {
    document.documentElement.classList.remove('homepage-entrance-locked');
    if (!document.body.classList.contains('hi-scroll-locked')) {
      document.documentElement.style.removeProperty('--hi-sbw');
    }
  }

  function revealAfterPaint(fn) {
    requestAnimationFrame(function() {
      requestAnimationFrame(fn);
    });
  }

  // Reveals everything below the hero together: the work section label and footer.
  // Case studies reveal on scroll (see homepage case study observer).
  function revealBelowHero(options) {
    var skipWorkRow = options && options.skipWorkRow;
    var workRow = document.querySelector('.homepage-section-row--work');
    if (workRow && !skipWorkRow) workRow.classList.add('homepage-section-row-in');
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
    var footerCol = document.querySelector('.homepage-footer-col');
    if (footerCol) footerCol.classList.add('homepage-footer-col-in');
    if (mediaRail) mediaRail.classList.add('homepage-media-rail-in');
  }

  function startEntrance(options) {
    // The index intro already showed the wordmark full-screen, so the header is
    // composed up front instead of animating in as staged follow-ups.
    var immediate = options && options.immediate;
    var returnVisit = options && options.returnVisit;

    // Return visit (in-site nav / back): skip the logo overlay but fade the
    // hero, carousel, and TOC together like the first-load intro slide-up.
    if (returnVisit) {
      revealAfterPaint(function() {
        if (hero) hero.classList.add('hero-in');
        var introRow = document.querySelector('.homepage-section-row--intro');
        if (introRow) introRow.classList.add('homepage-section-row-in');
        if (siteName) siteName.classList.add('site-name-in');
        if (siteMeta) siteMeta.classList.add('site-meta-in');
        if (mediaRail) mediaRail.classList.add('homepage-media-rail-in');
        revealBelowHero({ skipWorkRow: isWorkPage });
        if (typeof window.playHomepageMediaRailVideos === 'function') {
          window.playHomepageMediaRailVideos();
        }
        if (!(options && options.skipUnlock)) {
          unlockHomepageEntranceScroll();
        }
      });
      return;
    }

    // Stage 1: hero in immediately (all pages with a hero/intro).
    // Skip during panel restore — homepage elements must stay invisible until
    // the panel finishes its fade-in (see _revealHomepage below).
    // Skip when the index intro already revealed the hero (see home-intro.js).
    if ((hero || homepageIntro) && !(options && options.skipIntroReveal)) {
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          if (document.documentElement.classList.contains('hi-panel-restoring')) return;
          if (hero) hero.classList.add('hero-in');
          var introRow = document.querySelector('.homepage-section-row--intro');
          if (introRow) introRow.classList.add('homepage-section-row-in');
        });
      });
    }

    if (!homepageLayout) return; // header staging is homepage-only

    if (reduced || immediate) {
      if (siteName) siteName.classList.add('site-name-in');
      if (siteMeta) siteMeta.classList.add('site-meta-in');
      if (mediaRail) mediaRail.classList.add('homepage-media-rail-in');
      revealBelowHero({ skipWorkRow: isWorkPage });
      if (!(options && options.skipUnlock)) {
        unlockHomepageEntranceScroll();
      }
      return;
    }

    // Panel restore: expose a function that hi-panel.js calls once the panel
    // finishes its fade-in. All classes are applied while hi-panel-restoring is
    // still on <html> (transition: none), so everything snaps instantly with no
    // visible flash. The homepage is then ready for when the user closes the panel.
    if (document.documentElement.classList.contains('hi-panel-restoring')) {
      window._revealHomepage = function() {
        var introRow = document.querySelector('.homepage-section-row--intro');
        if (introRow) introRow.classList.add('homepage-section-row-in');
        if (siteName) siteName.classList.add('site-name-in');
        if (siteMeta) siteMeta.classList.add('site-meta-in');
        revealBelowHero();
        if (typeof window._revealHomepageCaseStudies === 'function') {
          window._revealHomepageCaseStudies();
        }
      };
      return;
    }

    if (isWorkPage) {
      if (siteName) siteName.classList.add('site-name-in');
      if (siteMeta) siteMeta.classList.add('site-meta-in');
      revealBelowHero({ skipWorkRow: true });
      unlockHomepageEntranceScroll();
      return;
    }

    // Stage 2: wordmark after hero
    setTimeout(function() {
      if (siteName) siteName.classList.add('site-name-in');
    }, 1000);

    // Stage 3: nav links + theme switcher + everything below the hero
    // Fires at 1350ms — halfway through the logo's 0.7s transition (1000ms + 350ms)
    setTimeout(function() {
      if (siteMeta) siteMeta.classList.add('site-meta-in');
      revealBelowHero();
      unlockHomepageEntranceScroll();
    }, 1350);
  }

  // On the index intro, js/home-intro.js calls this as the panel slides away.
  if (document.documentElement.classList.contains('home-intro-active')) {
    window._startHomepageEntrance = function() {
      startEntrance({ immediate: true, skipUnlock: true, skipIntroReveal: true });
    };
    window._unlockHomepageEntranceScroll = unlockHomepageEntranceScroll;
    return;
  }

  if (homepageLayout && introSeen) {
    startEntrance({ returnVisit: true });
    return;
  }

  startEntrance();
})();

(function() {
  // Homepage case studies: title + media animate together as one block on scroll.
  var homepageLayout = document.querySelector('.homepage-layout');
  if (!homepageLayout) return;

  var caseStudies = document.querySelectorAll('.homepage-case-study');
  if (!caseStudies.length) return;

  function revealHomepageCaseStudy(section) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        section.classList.add('homepage-case-study-in-view');
      });
    });
  }

  function revealAllHomepageCaseStudies() {
    for (var i = 0; i < caseStudies.length; i++) {
      revealHomepageCaseStudy(caseStudies[i]);
    }
  }

  window._revealHomepageCaseStudies = revealAllHomepageCaseStudies;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    revealAllHomepageCaseStudies();
    return;
  }

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        revealHomepageCaseStudy(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px 20px 0px', threshold: 0 }
  );

  for (var j = 0; j < caseStudies.length; j++) {
    observer.observe(caseStudies[j]);
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
  // About page: hero photo + intro fade up on load; work/press sections fade up on scroll.
  var aboutHeroPhoto = document.querySelector('.about-page-hero-photo');
  var aboutHeadline = document.querySelector('.about-page-headline-wrap');
  var aboutIntro = document.querySelector('.about-page-section-row--intro');
  var aboutScrollSections = document.querySelectorAll('.about-page-section-row--work, .about-page-section-row--now, .about-page-section-row--press');
  if (!aboutHeroPhoto && !aboutHeadline && !aboutIntro && !aboutScrollSections.length) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAboutSection(el) {
    if (el) el.classList.add('about-page-section-row-in');
  }

  if (reducedMotion) {
    revealAboutSection(aboutHeroPhoto);
    revealAboutSection(aboutHeadline);
    revealAboutSection(aboutIntro);
    aboutScrollSections.forEach(revealAboutSection);
    return;
  }

  if (aboutHeroPhoto || aboutHeadline || aboutIntro) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        revealAboutSection(aboutHeroPhoto);
        revealAboutSection(aboutHeadline);
        revealAboutSection(aboutIntro);
      });
    });
  }

  if (!aboutScrollSections.length) return;
  if (!('IntersectionObserver' in window)) {
    aboutScrollSections.forEach(revealAboutSection);
    return;
  }

  var workObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            revealAboutSection(entry.target);
          }, 100);
        }
      });
    },
    { rootMargin: '0px 0px 20px 0px', threshold: 0 }
  );
  aboutScrollSections.forEach(function(section) {
    workObserver.observe(section);
  });
})();

(function() {
  // Work page: case studies section fades in on scroll.
  var workPageRow = document.querySelector('.homepage-layout--work .homepage-section-row--work');
  if (!workPageRow) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealWorkPageRow() {
    workPageRow.classList.add('homepage-section-row-in');
  }

  if (reducedMotion) {
    revealWorkPageRow();
    return;
  }

  if (!('IntersectionObserver' in window)) {
    revealWorkPageRow();
    return;
  }

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          setTimeout(revealWorkPageRow, 100);
        }
      });
    },
    { rootMargin: '0px 0px 20px 0px', threshold: 0 }
  );
  observer.observe(workPageRow);
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
          var animateFigure = figure && (hasCaption || figure.classList.contains('case-study-figure-caption') || figure.classList.contains('case-study-two-col-image') || figure.classList.contains('case-study-image-duo'));
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
    var nodes = document.querySelectorAll('.site-footer-time');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = h + ':' + m + ':' + s;
    }
  }
  updateClock();
  setInterval(updateClock, 1000);
})();

(function() {
  // Theme switcher (light / dark) – class on html so head script can run before first paint
  var root = document.documentElement;
  var toggles = document.querySelectorAll('.theme-toggle');
  if (!toggles.length) return;

  function setThemeClass(theme) {
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

  var pending = 0;
  var pausedVideos = [];
  var THEME_SPREAD_MS = 420;
  var THEME_SPREAD_EASING = 'linear';
  var THEME_SPREAD_HOLD_MS = 480;

  function syncSpreadTimingFromCss() {
    var raw = getComputedStyle(root).getPropertyValue('--theme-spread-duration').trim();
    if (raw.slice(-2) === 'ms') THEME_SPREAD_MS = parseFloat(raw) || THEME_SPREAD_MS;
    else if (raw.slice(-1) === 's') THEME_SPREAD_MS = (parseFloat(raw) || 0.42) * 1000;

    var easing = getComputedStyle(root).getPropertyValue('--theme-spread-easing').trim();
    if (easing) THEME_SPREAD_EASING = easing;

    var holdRaw = getComputedStyle(root).getPropertyValue('--theme-spread-hold-duration').trim();
    if (holdRaw.slice(-2) === 'ms') THEME_SPREAD_HOLD_MS = parseFloat(holdRaw) || THEME_SPREAD_HOLD_MS;
    else if (holdRaw.slice(-1) === 's') THEME_SPREAD_HOLD_MS = (parseFloat(holdRaw) || 0.48) * 1000;
    else THEME_SPREAD_HOLD_MS = THEME_SPREAD_MS + 60;
  }

  syncSpreadTimingFromCss();

  function getViewportSize() {
    var vv = window.visualViewport;
    if (vv) {
      return {
        width: vv.width,
        height: vv.height,
        offsetX: vv.offsetLeft,
        offsetY: vv.offsetTop
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      offsetX: 0,
      offsetY: 0
    };
  }

  function getPointerCoords(event) {
    if (!event) return null;
    if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
      return { x: event.clientX, y: event.clientY };
    }
    if (event.changedTouches && event.changedTouches[0]) {
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      };
    }
    if (event.touches && event.touches[0]) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
    return null;
  }

  function isInFixedLayer(el) {
    if (!el) return false;
    var node = el;
    while (node && node !== document.documentElement) {
      if (getComputedStyle(node).position === 'fixed') return true;
      node = node.parentElement;
    }
    return false;
  }

  function getReferenceBox() {
    var vp = getViewportSize();
    return {
      width: Math.max(
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
        vp.width
      ),
      height: Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight,
        vp.height
      )
    };
  }

  // Clip-path percentages map to the VT root snapshot (full document), not the
  // viewport. A viewport-sized px radius stops expanding once it hits the screen
  // edge while content below the fold is still uncovered — then the transition
  // ends and the remainder snaps to the new theme.
  function getSpreadClip(el, event) {
    var vp = getViewportSize();
    var ref = getReferenceBox();
    var scrollX = window.scrollX || window.pageXOffset || 0;
    var scrollY = window.scrollY || window.pageYOffset || 0;
    var x = null;
    var y = null;

    if (el) {
      var rect = el.getBoundingClientRect();
      if (rect.width || rect.height) {
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    // Fallback if the toggle has no box (display:none duplicate, etc.)
    if ((x === null || y === null) && event) {
      var pointer = getPointerCoords(event);
      if (pointer) {
        x = pointer.x;
        y = pointer.y;
      }
    }

    if (x === null || y === null || !ref.width || !ref.height) return null;

    // Fixed header toggle: viewport coords, not document scroll coords.
    var fixedOrigin = isInFixedLayer(el);
    var docX = fixedOrigin ? x : x + scrollX;
    var docY = fixedOrigin ? y : y + scrollY;
    var xPct = (docX / ref.width) * 100;
    var yPct = (docY / ref.height) * 100;

    var maxDist = Math.max(
      Math.hypot(docX, docY),
      Math.hypot(ref.width - docX, docY),
      Math.hypot(docX, ref.height - docY),
      Math.hypot(ref.width - docX, ref.height - docY)
    );
    var diagonal = Math.hypot(ref.width, ref.height);
    // Generous buffer so the final frame fully covers the snapshot before VT ends.
    var radiusPct = Math.max(150, Math.ceil((maxDist / diagonal) * 100) + 15);

    return {
      from: 'circle(0% at ' + xPct + '% ' + yPct + '%)',
      to: 'circle(' + radiusPct + '% at ' + xPct + '% ' + yPct + '%)'
    };
  }

  function cancelLingeringNewRootAnimations() {
    // Only clear prior WAAPI on the new snapshot. Do NOT cancel
    // ::view-transition-group(root) — that hold keeps Chrome from ending the
    // transition early (which reads as a mid-spread "stop").
    if (!root.getAnimations) return;
    var prior = [];
    try {
      prior = root.getAnimations({ subtree: true });
    } catch (err) {
      try { prior = root.getAnimations(); } catch (err2) {}
    }
    for (var i = 0; i < prior.length; i++) {
      var a = prior[i];
      if (a.effect && a.effect.pseudoElement === '::view-transition-new(root)') {
        try { a.cancel(); } catch (err) {}
      }
    }
  }

  function runSpreadAnimation(origin, event) {
    var clip = getSpreadClip(origin, event);
    if (!clip) return Promise.resolve();

    try {
      cancelLingeringNewRootAnimations();

      var toMatch = clip.to.match(/circle\(([0-9.]+)(px|%)/);
      var toR = toMatch ? parseFloat(toMatch[1]) : 0;
      var unit = toMatch ? toMatch[2] : 'px';
      var atMatch = clip.from.match(/at\s+(.+)\)$/);
      var at = atMatch ? atMatch[1] : null;

      var fromPath = clip.from;
      var toPath = clip.to;
      if (toR && at) {
        var startR = unit === '%'
          ? Math.max(0.5, toR * 0.02)
          : Math.min(14, toR * 0.02);
        var startStr = unit === '%' ? startR.toFixed(2) : String(Math.round(startR));
        var endStr = unit === '%' ? toR.toFixed(2) : String(Math.round(toR));
        fromPath = 'circle(' + startStr + unit + ' at ' + at + ')';
        toPath = 'circle(' + endStr + unit + ' at ' + at + ')';
      }

      var anim = root.animate(
        [{ clipPath: fromPath }, { clipPath: toPath }],
        {
          duration: THEME_SPREAD_MS,
          easing: THEME_SPREAD_EASING,
          fill: 'both',
          pseudoElement: '::view-transition-new(root)'
        }
      );
      return anim.finished.catch(function() {});
    } catch (err) {
      return Promise.resolve();
    }
  }

  // Snapshotting playing <video> on mobile is expensive and stalls the VT capture.
  // Pause them for the transition, then resume — VT still shows a still frame, but
  // the capture hitch and decoder fights go away.
  function pauseVideosForTransition() {
    pausedVideos = [];
    var videos = document.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      var v = videos[i];
      if (!v.paused && !v.ended) {
        pausedVideos.push(v);
        try { v.pause(); } catch (e) {}
      }
    }
  }

  function resumeVideosAfterTransition() {
    for (var i = 0; i < pausedVideos.length; i++) {
      var v = pausedVideos[i];
      try {
        var p = v.play();
        if (p && typeof p.catch === 'function') p.catch(function() {});
      } catch (e) {}
    }
    pausedVideos = [];
  }

  function readSpreadDurationMs() {
    return THEME_SPREAD_MS;
  }

  function readSpreadEasing() {
    return THEME_SPREAD_EASING;
  }

  function applyTheme(theme, options) {
    var instant = options && options.instant;
    var origin = options && options.origin;
    var event = options && options.event;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (instant || reduced) {
      setThemeClass(theme);
      return;
    }

    if (document.startViewTransition) {
      syncSpreadTimingFromCss();
      // Rapid clicks overlap: only the last transition standing clears the classes
      pending++;
      root.classList.add('theme-switching');
      if (origin) root.classList.add('theme-spread');

      if (origin) {
        root.style.setProperty('--theme-spread-hold-duration', THEME_SPREAD_HOLD_MS + 'ms');
      }

      pauseVideosForTransition();

      var transition = document.startViewTransition(function() {
        setThemeClass(theme);
      });

      var spreadPromise = Promise.resolve();
      if (origin) {
        spreadPromise = transition.ready.then(function() {
          return runSpreadAnimation(origin, event);
        }).catch(function() {});
      }

      Promise.all([transition.finished, spreadPromise]).finally(function() {
        pending--;
        if (pending > 0) return;
        root.classList.remove('theme-switching');
        root.classList.remove('theme-spread');
        root.style.removeProperty('--theme-spread-hold-duration');
        resumeVideosAfterTransition();
      });
      return;
    }

    root.classList.add('theme-switching');
    setThemeClass(theme);
    void root.offsetWidth;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        root.classList.remove('theme-switching');
      });
    });
  }

  var stored = null;
  try {
    stored = window.localStorage && localStorage.getItem('theme');
  } catch (e) {}

  if (stored === 'dark' || stored === 'blue') {
    applyTheme('dark', { instant: true });
  } else if (stored === 'light') {
    applyTheme('light', { instant: true });
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark', { instant: true });
  } else if (root.classList.contains('dark')) {
    applyTheme('dark', { instant: true });
  }

  toggles.forEach(function(toggle) {
    var lastPointer = null;

    toggle.addEventListener('pointerdown', function(event) {
      lastPointer = getPointerCoords(event);
    }, { passive: true });

    toggle.addEventListener('click', function(event) {
      var next = root.classList.contains('dark') ? 'light' : 'dark';
      var pointerEvent = event;
      if (lastPointer) {
        pointerEvent = {
          clientX: lastPointer.x,
          clientY: lastPointer.y
        };
      }
      applyTheme(next, { origin: toggle, event: pointerEvent });
      lastPointer = null;
      try {
        window.localStorage && localStorage.setItem('theme', next);
      } catch (err) {}
    });
  });
})();

(function() {
  // Hamburger menu: at 900px use full-screen overlay; desktop uses dropdown
  var btn = document.getElementById('hamburger-btn');
  var dropdown = document.getElementById('site-nav-dropdown');
  if (!btn || !dropdown) return;

  var overlay = null;

  function closeMenu(instant) {
    if (instant) document.documentElement.classList.add('mobile-menu-instant');
    btn.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('is-open');
    document.body.classList.remove('mobile-menu-open');
    var menuOverlay = overlay || document.getElementById('mobile-menu-overlay');
    if (menuOverlay && menuOverlay.parentNode) {
      menuOverlay.parentNode.removeChild(menuOverlay);
    }
    overlay = null;
    if (instant) {
      requestAnimationFrame(function() {
        document.documentElement.classList.remove('mobile-menu-instant');
      });
    }
  }

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-open');
    if (window.innerWidth <= 900) {
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
        if (a.style.display === 'none' || window.getComputedStyle(a).display === 'none') return;
        var link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = a.textContent;
        if (a.classList.contains('nav-active')) link.classList.add('nav-active');
        linksWrap.appendChild(link);
      });
      overlay.appendChild(linksWrap);
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

  // Back/forward cache restores the page with the menu still open — reset instantly.
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) closeMenu(true);
  });

  document.addEventListener('click', function(e) {
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    // Mobile overlay: close only via the X button (not backdrop or outside clicks)
    if (overlay) return;
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) closeMenu();
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
    return window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
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

(function() {
  // Standalone case studies and about page: same eased wheel scrolling as the homepage media rail.
  var caseStudy = document.querySelector('.case-study:not(.blog-post):not(.blog-index)');
  var aboutPage = document.querySelector('.about-hero');
  if (!caseStudy && !aboutPage) return;

  var DESKTOP_MQ = window.matchMedia('(min-width: 1001px)');
  var REDUCED_MQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE = 0.075;

  var currentTop = window.scrollY || 0;
  var targetTop = currentTop;
  var animating = false;
  var wheelBound = false;

  function maxScrollTop() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clampTarget() {
    if (targetTop < 0) targetTop = 0;
    var max = maxScrollTop();
    if (targetTop > max) targetTop = max;
  }

  function shouldIgnoreWheel(e) {
    if (!DESKTOP_MQ.matches || REDUCED_MQ.matches) return true;
    if (document.body.classList.contains('hi-scroll-locked')) return true;
    var lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('is-visible')) return true;
    if (e.target.closest('.hi-panel')) return true;

    var node = e.target;
    while (node && node !== document.body) {
      if (node.scrollHeight > node.clientHeight + 1) {
        var style = window.getComputedStyle(node);
        if (/(auto|scroll)/.test(style.overflowY)) return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  function step() {
    var distance = targetTop - currentTop;
    currentTop += distance * EASE;

    var settled = Math.abs(distance) < 0.12;
    if (settled) currentTop = targetTop;

    window.scrollTo(0, currentTop);

    if (settled) {
      animating = false;
      return;
    }
    requestAnimationFrame(step);
  }

  function startAnimation() {
    if (animating) return;
    animating = true;
    requestAnimationFrame(step);
  }

  function onWheel(e) {
    if (shouldIgnoreWheel(e)) return;
    e.preventDefault();
    targetTop += e.deltaY;
    clampTarget();
    startAnimation();
  }

  function onScroll() {
    if (!DESKTOP_MQ.matches || animating) return;
    currentTop = targetTop = window.scrollY || 0;
  }

  function setEnabled(on) {
    document.documentElement.classList.toggle('case-study-smooth-scroll', on);
    if (on && !wheelBound) {
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('scroll', onScroll, { passive: true });
      wheelBound = true;
      currentTop = targetTop = window.scrollY || 0;
    } else if (!on && wheelBound) {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      wheelBound = false;
      animating = false;
      currentTop = targetTop = window.scrollY || 0;
    }
  }

  function updateMode() {
    setEnabled(DESKTOP_MQ.matches && !REDUCED_MQ.matches);
  }

  if (typeof DESKTOP_MQ.addEventListener === 'function') {
    DESKTOP_MQ.addEventListener('change', updateMode);
  } else if (typeof DESKTOP_MQ.addListener === 'function') {
    DESKTOP_MQ.addListener(updateMode);
  }

  if (typeof REDUCED_MQ.addEventListener === 'function') {
    REDUCED_MQ.addEventListener('change', updateMode);
  } else if (typeof REDUCED_MQ.addListener === 'function') {
    REDUCED_MQ.addListener(updateMode);
  }

  updateMode();
})();
