/**
 * Input handling: tap zones, swipe, keyboard
 * Per input-contract.md
 * US5: Mobile tap zones (bottom area) + swipe; desktop keyboard (Arrow Left/Right, A/D)
 */

/** @typedef {0|1|2} Lane */
/** @typedef {'left'|'right'} MoveDirection */

const THROTTLE_MS = 150;
const SWIPE_THRESHOLD = 50;
/** Bottom fraction of screen used as tap zones (per input-contract: tap zones at bottom) */
const TAP_ZONE_BOTTOM_FRACTION = 0.5;

/**
 * @param {HTMLElement} element
 * @param {(direction: MoveDirection) => void} onMove
 * @param {() => boolean} canAcceptInput - e.g. !motorcycle.isSliding && state.isPlaying()
 */
export function setupInput(element, onMove, canAcceptInput) {
  let lastMoveTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  function tryMove(direction) {
    if (!canAcceptInput()) return;
    const now = Date.now();
    if (now - lastMoveTime < THROTTLE_MS) return;
    lastMoveTime = now;
    onMove(direction);
  }

  /** Desktop: Arrow Left/Right, A/D (key repeat ignored) */
  function handleKeyDown(e) {
    if (e.repeat) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      tryMove('left');
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      tryMove('right');
    }
  }

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  /** Mobile: swipe (horizontal dominant) or tap in bottom zone */
  function handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) >= Math.abs(dy)) {
      e.preventDefault();
      tryMove(dx > 0 ? 'right' : 'left');
      return;
    }

    const rect = element.getBoundingClientRect();
    const tapZoneTop = rect.top + rect.height * (1 - TAP_ZONE_BOTTOM_FRACTION);
    const inTapZone = touchStartY >= tapZoneTop;
    if (inTapZone && Math.abs(dx) < SWIPE_THRESHOLD) {
      e.preventDefault();
      const midX = rect.left + rect.width / 2;
      tryMove(touch.clientX < midX ? 'left' : 'right');
    }
  }

  function handleTap(e) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const tapZoneTop = rect.top + rect.height * (1 - TAP_ZONE_BOTTOM_FRACTION);
    if (y < tapZoneTop) return;
    const midX = rect.left + rect.width / 2;
    if (x < midX) {
      tryMove('left');
    } else {
      tryMove('right');
    }
  }

  document.addEventListener('keydown', handleKeyDown);
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: false });
  element.addEventListener('click', (e) => {
    if (e.target === element || element.contains(e.target)) {
      handleTap(e);
    }
  });

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * @param {Lane} currentLane
 * @param {MoveDirection} direction
 * @returns {Lane}
 */
export function applyLaneMove(currentLane, direction) {
  if (direction === 'left') {
    return /** @type {Lane} */ (Math.max(0, currentLane - 1));
  }
  return /** @type {Lane} */ (Math.min(2, currentLane + 1));
}
