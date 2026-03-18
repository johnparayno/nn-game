# UI Contract: Motorcycle Arcade PWA Game

**Feature**: 001-motorcycle-arcade-pwa  
**Date**: 2025-03-18

## Screens

### Loading

| Element | Purpose |
|---------|---------|
| Progress indicator | Shows asset load progress |
| (Optional) Logo/title | Branding placeholder |

**Transition**: When assets loaded → Start screen

---

### Start

| Element | Purpose |
|---------|---------|
| Rider selection | 3 options; player selects 1 before play |
| Start/Play button | Begins game |
| Session high score | Best score this session |
| Mute toggle | Enable/disable sound |

**Transition**: Tap Play → Playing

---

### Playing

| Element | Purpose |
|---------|---------|
| Canvas | Game view (road, motorcycle, obstacles, collectibles) |
| Score display | Distance + coins (single value) |
| Fuel meter | Current fuel level |
| Mute toggle | In-game mute |
| (Implicit) Pause | On visibility hidden (backgrounded) |

**Transition**: Collision (car/roadblock) or fuel=0 → Game Over; Oil → slip penalty (no transition)

---

### Game Over

| Element | Purpose |
|---------|---------|
| Final score | Distance + coins |
| Session high score | Best this session |
| Restart button | Returns to fresh run |

**Transition**: Tap Restart → Start (then Play → Playing)

---

### Offline (First Visit)

| Element | Purpose |
|---------|---------|
| Message | Explain game requires initial load |
| Retry button | Retry when back online |

**Transition**: When online and loaded → Loading

---

## Layout

- Portrait only; motorcycle anchored at bottom
- Road scrolls upward (top-down perspective)
- 3 lanes; responsive scaling
