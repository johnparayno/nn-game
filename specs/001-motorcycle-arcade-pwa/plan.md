# Implementation Plan: Motorcycle Arcade PWA Game

**Branch**: `001-motorcycle-arcade-pwa` | **Date**: 2025-03-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-motorcycle-arcade-pwa/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a mobile-first PWA arcade game where the player controls a motorcycle on an endless 3-lane road. Core loop: avoid obstacles (cars, roadblocks, oil spills), collect rewards (coins, fuel), survive as long as possible with increasing difficulty. Uses vanilla JavaScript and HTML5 Canvas per constitution; no framework. PWA features (manifest, service worker) enable installability and offline play after initial load.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3  
**Primary Dependencies**: Vanilla JS, HTML5 Canvas, Web Audio API, Service Worker API, Web App Manifest  
**Storage**: sessionStorage (high score, mute preference); no backend  
**Testing**: Manual testing for MVP; optional Vitest for unit tests of game logic (see research.md)  
**Target Platform**: Mobile browsers (PWA), desktop for development; portrait-only  
**Project Type**: PWA / browser game  
**Performance Goals**: 60fps, <5s load to playable, <100ms input latency (per spec SC-001, SC-002, SC-008)  
**Constraints**: Offline-capable after first load, portrait lock, mobile-first responsive layout  
**Scale/Scope**: Single-player arcade MVP; no accounts, no multiplayer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with `.specify/memory/constitution.md`:

- [x] **Arcade-First**: Fast, accessible browser; simple controls; immediate feedback; short sessions
- [x] **Plain JS & Canvas**: Vanilla web tech; no framework unless it clearly speeds development
- [x] **Core Loop First**: One polished core loop validated before menus, upgrades, missions, or polish
- [x] **Minimal Complexity**: No overengineering; no heavy frameworks; no backend unless justified
- [x] **Clean, Changeable Code**: Structured around game states, entities, reusable mechanics
- [x] **Placeholder Assets**: Using placeholders until game feel validated

## Project Structure

### Documentation (this feature)

```text
specs/001-motorcycle-arcade-pwa/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
index.html              # Entry point
manifest.json           # PWA manifest
sw.js                   # Service worker
css/
├── main.css
└── ...
js/
├── main.js             # Entry, game loop, state machine
├── game/
│   ├── state.js        # Game states (loading, start, playing, paused, game-over)
│   ├── entities.js     # Motorcycle, obstacles, collectibles
│   ├── road.js         # Road rendering, lanes
│   ├── collision.js    # Collision detection
│   ├── spawner.js      # Obstacle/collectible spawn logic
│   └── input.js        # Touch, swipe, keyboard
├── audio.js            # Web Audio API, mute
├── storage.js          # sessionStorage helpers
└── pwa.js              # Service worker registration, offline detection
assets/
├── sounds/             # Placeholder sound effects
└── images/             # Placeholder sprites/graphics
```

**Structure Decision**: Single-project web app. Flat `js/` with `game/` subfolder for core loop. No build step for MVP; static HTML/CSS/JS served directly. PWA files (manifest, sw) at root.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |
