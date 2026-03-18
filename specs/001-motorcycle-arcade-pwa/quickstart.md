# Quickstart: Motorcycle Arcade PWA Game

**Feature**: 001-motorcycle-arcade-pwa  
**Branch**: `001-motorcycle-arcade-pwa`

## Prerequisites

- Modern browser (Chrome, Safari, Firefox, Edge) with JavaScript enabled
- For PWA: HTTPS or localhost
- For mobile testing: Device or emulator with touch support

## Run Locally

1. **Clone and checkout**:
   ```bash
   git checkout 001-motorcycle-arcade-pwa
   ```

2. **Serve the app** (static files; no build step for MVP):
   ```bash
   # Option A: Python
   python3 -m http.server 8080

   # Option B: Node (if npx available)
   npx serve -p 8080

   # Option C: Any static file server
   ```

3. **Open**: `http://localhost:8080` (or your server URL)

4. **Mobile testing**: Use same network; open `http://<your-ip>:8080` on device

## Project Layout

```text
index.html       # Entry
manifest.json    # PWA manifest
sw.js            # Service worker
css/
js/
  main.js        # Entry, game loop
  game/          # Core loop modules
  audio.js
  storage.js
  pwa.js
assets/
```

## Key Commands

| Command | Purpose |
|---------|---------|
| Open in browser | Play/test |
| (Optional) `npm test` | If Vitest added later |
| (Optional) `npm run lint` | If linter added |

## PWA Install

1. Load game in supported browser (Chrome, Edge, Safari)
2. Use "Add to Home Screen" or install prompt
3. Launch from home screen; runs fullscreen-like

## Offline

- First load: requires network
- After first load: works offline (service worker caches assets)
- Never loaded + offline: shows message with retry button

## Development Notes

- No build step for MVP
- Edit `js/`, `css/`, `index.html` directly
- Refresh to see changes (service worker may need "Update on reload" in DevTools)
