# Input Contract: Motorcycle Arcade PWA Game

**Feature**: 001-motorcycle-arcade-pwa  
**Date**: 2025-03-18

## Mobile (Touch)

| Input | Action |
|-------|--------|
| Tap left zone | Move motorcycle left (lane -1) |
| Tap right zone | Move motorcycle right (lane +1) |
| Swipe left | Move motorcycle left |
| Swipe right | Move motorcycle right |

**Constraints**:
- Lane bounds: 0, 1, 2 (no wrap)
- Debounce/throttle rapid input
- Tap zones: bottom area of screen (below game canvas or overlay)
- Swipe: horizontal; ignore vertical swipes or treat as horizontal if dominant

---

## Desktop (Keyboard)

| Key | Action |
|-----|--------|
| Arrow Left / A | Move motorcycle left |
| Arrow Right / D | Move motorcycle right |

**Constraints**:
- Same lane bounds
- Key repeat: throttle or ignore rapid repeats

---

## Global

| Event | Action |
|-------|--------|
| visibilitychange (hidden) | Pause game |
| visibilitychange (visible) | Resume game |

---

## Ignored

- Taps outside game area
- Vertical-only swipes (or map to no-op)
- Input during loading, start screen (except Play, rider select, mute)
- Input during oil slide (temporary lock)
