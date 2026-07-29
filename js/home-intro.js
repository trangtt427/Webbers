/**
 * Homepage intro overlay: the wordmark draws in letter by letter over a blank
 * screen, then a loading bar fills with random buffering pauses and the panel
 * slides up when the bar completes.
 *
 * Loads after main.js, which parks the homepage entrance on
 * window._startHomepageEntrance until the panel starts moving.
 */
(function() {
  var root = document.documentElement;
  var overlay = document.getElementById('home-intro');
  if (!overlay || !root.classList.contains('home-intro-active')) return;

  var BLANK_MS = 700; // solid blank screen before the first letter animates in
  var WORDMARK_MS = 1120; // last letter + dot finish (~0.77s delay + 0.35s animation)
  var BAR_BUDGET_MS = 1000; // target duration for the loading bar after the logo
  var SLIDE_MS = 1000; // must match the transition on .home-intro
  var CONTENT_LEAD_MS = 250; // page starts composing while the panel is still moving

  var progressRaf = 0;

  function revealContent() {
    var block = document.querySelector('.homepage-entrance-content');
    if (block) block.classList.add('homepage-entrance-content-in');
    var introRow = document.querySelector('.homepage-section-row--intro');
    if (introRow) introRow.classList.add('homepage-section-row-in');
  }

  function startPage() {
    if (typeof window._startHomepageEntrance === 'function') {
      window._startHomepageEntrance();
      window._startHomepageEntrance = null;
    }
  }

  function slideUp() {
    revealContent();
    root.classList.add('home-intro-exit');
    setTimeout(startPage, CONTENT_LEAD_MS);
    setTimeout(teardown, SLIDE_MS);
  }

  function teardown() {
    if (progressRaf) cancelAnimationFrame(progressRaf);
    root.classList.remove('home-intro-active', 'home-intro-exit', 'home-intro-letters-in', 'home-intro-progress-in');
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (typeof window._unlockHomepageEntranceScroll === 'function') {
      window._unlockHomepageEntranceScroll();
      window._unlockHomepageEntranceScroll = null;
    }
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function setProgress(bar, value) {
    bar.style.transform = 'scaleX(' + value + ')';
  }

  function finishProgressBar(bar) {
    if (progressRaf) cancelAnimationFrame(progressRaf);
    progressRaf = 0;
    if (bar) setProgress(bar, 1);
  }

  function animateProgress(bar, from, to, durationMs, done) {
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / durationMs);
      setProgress(bar, from + (to - from) * t);
      if (t < 1) {
        progressRaf = requestAnimationFrame(frame);
      } else {
        progressRaf = 0;
        done();
      }
    }
    progressRaf = requestAnimationFrame(frame);
  }

  function buildMilestones(from, to) {
    var count = 5 + Math.floor(Math.random() * 4);
    var milestones = [from];
    var reached = from;
    for (var i = 0; i < count - 1; i++) {
      reached += (to - reached) * randomBetween(0.1, 0.32);
      milestones.push(reached);
    }
    milestones.push(to);
    return milestones;
  }

  function buildPausePlan(chunkCount) {
    var pauseCount = Math.random() < 0.5 ? 1 : 2;
    var slots = [];
    var candidates = [];
    for (var i = 0; i < chunkCount - 1; i++) candidates.push(i);

    for (var p = 0; p < pauseCount && candidates.length; p++) {
      var pick = Math.floor(Math.random() * candidates.length);
      slots.push(candidates.splice(pick, 1)[0]);
    }

    slots.sort(function(a, b) { return a - b; });
    return {
      slots: slots,
      longSlot: slots.length ? slots[Math.floor(Math.random() * slots.length)] : -1
    };
  }

  function pauseDuration(plan, chunkIndex) {
    return chunkIndex === plan.longSlot
      ? randomBetween(520, 850)
      : randomBetween(180, 450);
  }

  function runBufferedProgress(bar, onComplete) {
    if (!bar) {
      onComplete();
      return;
    }

    var milestones = buildMilestones(0, 1);
    var chunkCount = milestones.length - 1;
    var pausePlan = buildPausePlan(chunkCount);
    var current = 0;
    var chunkIndex = 0;

    function step() {
      if (chunkIndex >= chunkCount) {
        finishProgressBar(bar);
        onComplete();
        return;
      }

      var target = milestones[chunkIndex + 1];
      var duration = Math.min(
        randomBetween(220, 480),
        Math.max(120, BAR_BUDGET_MS / chunkCount)
      );

      animateProgress(bar, current, target, duration, function() {
        current = target;
        var finishedChunk = chunkIndex;
        chunkIndex += 1;
        if (chunkIndex >= chunkCount) {
          finishProgressBar(bar);
          onComplete();
          return;
        }
        if (pausePlan.slots.indexOf(finishedChunk) !== -1) {
          setTimeout(step, pauseDuration(pausePlan, finishedChunk));
        } else {
          step();
        }
      });
    }

    step();
  }

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    revealContent();
    teardown();
    startPage();
    return;
  }

  setTimeout(function() {
    root.classList.add('home-intro-letters-in');
    setTimeout(function() {
      var bar = overlay.querySelector('.home-intro-progress-bar');
      root.classList.add('home-intro-progress-in');
      runBufferedProgress(bar, slideUp);
    }, WORDMARK_MS);
  }, BLANK_MS);
})();
