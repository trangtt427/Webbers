/**
 * Homepage hero icon pattern: settings, smile, and confetti morph-cycle
 * through three slots. Vector separators stay static.
 */
(function() {
  var pattern = document.querySelector('.homepage-hero-icon-pattern');
  if (!pattern) return;

  var slots = pattern.querySelectorAll('.homepage-hero-icon-slot');
  if (!slots.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

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
    for (var i = 0; i < slots.length; i++) {
      setSlotIcon(slots[i], iconForSlot(i, cycleStep));
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
