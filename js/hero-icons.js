/**
 * Homepage hero icon pattern: settings, smile, and confetti morph-cycle
 * through three slots. Vector separators stay static.
 *
 * Each cycle (staggered):
 *   1. smile transplaces settings
 *   2. settings transplaces confetti
 *   3. confetti transplaces smile
 */
(function() {
  var pattern = document.querySelector('.homepage-hero-icon-pattern');
  if (!pattern) return;

  var slots = pattern.querySelectorAll('.homepage-hero-icon-slot');
  if (!slots.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var STAGGER_MS = 140;
  var CYCLE_MS = 2400;
  var step = 0;
  var timer = null;

  function iconForSlot(slotIndex, cycleStep) {
    return (cycleStep + slotIndex) % 3;
  }

  function setSlotIcon(slot, iconIndex) {
    var icons = slot.querySelectorAll('.homepage-hero-icon[data-icon]');
    for (var i = 0; i < icons.length; i++) {
      var icon = icons[i];
      if (icon.getAttribute('data-icon') === String(iconIndex)) {
        icon.classList.add('is-active');
      } else {
        icon.classList.remove('is-active');
      }
    }
  }

  function applyStep(cycleStep) {
    var order = [0, 2, 1];
    for (var i = 0; i < order.length; i++) {
      (function(slotIndex, delay) {
        setTimeout(function() {
          setSlotIcon(slots[slotIndex], iconForSlot(slotIndex, cycleStep));
        }, delay);
      })(order[i], i * STAGGER_MS);
    }
  }

  function advance() {
    step += 1;
    applyStep(step);
  }

  applyStep(step);
  timer = window.setInterval(advance, CYCLE_MS);

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return;
    }
    if (!timer) {
      timer = window.setInterval(advance, CYCLE_MS);
    }
  });
})();
