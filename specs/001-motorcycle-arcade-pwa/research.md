# Research: Motorcycle Arcade PWA Game

**Feature**: 001-motorcycle-arcade-pwa  
**Date**: 2025-03-18

## 1. Testing Strategy for Vanilla JS Canvas Games

**Decision**: Manual testing for MVP; optional Vitest for unit tests of pure game logic (collision, spawn, score).

**Rationale**:
- Canvas games are hard to automate: DOM selectors don't apply; pixel-based testing requires visual/assertion tools.
- Constitution requires **Minimal Complexity**; heavy E2E (Playwright, Cypress) adds build and dev overhead.
- Manual testing is sufficient to validate core loop, input, and PWA behavior for MVP.
- Pure game logic (collision, spawn rate, score calculation) can be unit-tested in isolation if extracted into pure functions.

**Alternatives considered**:
- **Playwright/Cypress**: Overkill for MVP; canvas assertions are non-trivial.
- **AI-based visual testing**: Emerging but adds complexity; not justified for MVP.
- **Vitest**: Lightweight, fast; good for unit tests of game logic. Optional for MVP.

---

## 2. PWA Service Worker Cache Strategy

**Decision**: Cache-first for all static assets (HTML, CSS, JS, images, sounds). Precache during install; serve from cache when offline.

**Rationale**:
- Game has no backend; all assets are static. Cache-first is ideal for static content.
- Spec requires: "game can be launched and played when offline after initial load."
- First visit offline: show message with retry (per spec FR-020); no precache before first load.

**Alternatives considered**:
- **Network-first**: Adds latency; not needed for static game assets.
- **Stale-while-revalidate**: Useful for fresh content; not needed for MVP game assets.

---

## 3. Game Loop and Input Handling

**Decision**: `requestAnimationFrame` for game loop; `visibilitychange` for pause/resume.

**Rationale**:
- `requestAnimationFrame` syncs with display refresh; standard for 60fps canvas games.
- `document.visibilityState` / `visibilitychange` for background/foreground: pause when hidden, resume when visible (per spec FR-019).

**Alternatives considered**:
- `setInterval`: Less smooth; can drift from display refresh.
- `Page Visibility API`: Standard approach; no alternatives needed.

---

## 4. Touch Input: Tap Zones vs Swipe

**Decision**: Both tap zones and swipe. Left/right tap zones at bottom of screen; horizontal swipe anywhere for lane change.

**Rationale**:
- Spec: "Both tap zones and swipe — player can use either" (FR-003).
- Tap zones: simple, reliable on small screens.
- Swipe: natural for lane-based movement; debounce/throttle to avoid erratic input.

---

## 5. Oil Spill Penalty (Slip/Slide)

**Decision**: Temporary loss of control: motorcycle slides in lane for ~1–2 seconds; player cannot change lanes during slide.

**Rationale**:
- Spec: "Oil causes slip/slide or temporary penalty" (FR-004, FR-005).
- Instant game over for cars/roadblocks; oil differentiates obstacle types.
- Short penalty keeps sessions snappy; aligns with arcade-first philosophy.

**Alternatives considered**:
- Speed reduction: Less dramatic; harder to communicate.
- Lane lock: Clear, simple, matches "slip" metaphor.
