---
description: "Task list for Motorcycle Arcade PWA implementation"
---

# Tasks: Motorcycle Arcade PWA Game

**Input**: Design documents from `specs/001-motorcycle-arcade-pwa/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Manual testing for MVP per research.md; no automated test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `index.html`, `manifest.json`, `sw.js`, `css/`, `js/`, `assets/` at repository root
- No build step for MVP

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure: index.html, manifest.json, sw.js, css/, js/, assets/ at repo root
- [X] T002 Initialize index.html with canvas, meta viewport, portrait orientation meta
- [X] T003 [P] Configure main.css with responsive layout and portrait lock in css/main.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement game state machine (loading, start, playing, paused, game-over) in js/game/state.js
- [X] T005 Implement game loop with requestAnimationFrame in js/main.js
- [X] T006 [P] Implement storage module with sessionStorage helpers in js/storage.js
- [X] T007 Setup canvas and resize handling in js/main.js
- [X] T008 Implement visibility API pause/resume (visibilitychange) in js/main.js
- [X] T009 Implement loading screen with progress indicator in index.html and js/main.js
- [X] T010 Implement minimal start screen (tap to play) for transition to playing in js/main.js

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 - Start and Play Core Game (Priority: P1) 🎯 MVP

**Goal**: Player controls motorcycle on endless 3-lane road; avoids obstacles; collects coins/fuel; survives with score; collision (car/roadblock) or fuel=0 ends game; oil causes slip penalty.

**Independent Test**: Launch game, move motorcycle, avoid obstacle, collect item, trigger collision — core arcade experience works.

### Implementation for User Story 1

- [X] T011 [P] [US1] Create Motorcycle, Obstacle, Collectible entities in js/game/entities.js
- [X] T012 [P] [US1] Implement road rendering and 3-lane layout in js/game/road.js
- [X] T013 [US1] Implement collision detection (car/roadblock/oil, collectibles) in js/game/collision.js
- [X] T014 [US1] Implement spawner for obstacles and collectibles in js/game/spawner.js
- [X] T015 [US1] Implement input handling (tap zones, swipe, keyboard) in js/game/input.js
- [X] T016 [US1] Implement score (distance + coins), fuel meter, game over logic in js/main.js
- [X] T017 [US1] Implement oil slide penalty (temporary lane lock) in js/game/entities.js
- [X] T018 [US1] Wire playing state: canvas, score display, fuel meter in js/main.js

**Checkpoint**: Core gameplay loop fully functional and testable

---

## Phase 4: User Story 2 - Start Screen and Restart Flow (Priority: P2)

**Goal**: Start screen with rider selection (3 options), play button, high score; game over screen with final score, high score, restart; complete session loop.

**Independent Test**: Open game (start screen), start game, end game (game over), tap restart — full session loop works.

### Implementation for User Story 2

- [X] T019 [US2] Implement start screen UI (rider selection, play button, high score, mute) in index.html and js/main.js
- [X] T020 [US2] Implement game over screen UI (final score, high score, restart button) in index.html and js/main.js
- [X] T021 [US2] Wire state transitions: start→playing, game-over→start, persist selectedRider in js/main.js

**Checkpoint**: Start and restart flow complete

---

## Phase 5: User Story 3 - Increasing Difficulty (Priority: P3)

**Goal**: Obstacle spawn rate increases over time; scroll speed constant; natural difficulty curve.

**Independent Test**: Survive extended period; observe spawn rate increases; game remains playable.

### Implementation for User Story 3

- [X] T022 [US3] Implement spawn rate increase over time in js/game/spawner.js

**Checkpoint**: Difficulty escalates with survival time

---

## Phase 6: User Story 4 - PWA Installability and Offline Support (Priority: P4)

**Goal**: Installable PWA; works offline after first load; fullscreen-like when launched from home screen; offline-first-visit shows message with retry.

**Independent Test**: Install from browser, launch from home screen, play offline; first-visit offline shows message.

### Implementation for User Story 4

- [X] T023 [P] [US4] Create manifest.json with PWA config (name, icons, display, orientation)
- [X] T024 [US4] Implement service worker with cache-first strategy in sw.js
- [X] T025 [US4] Implement pwa.js registration and offline detection in js/pwa.js
- [X] T026 [US4] Implement offline-first-visit message and retry button in index.html and js/main.js

**Checkpoint**: PWA installable and offline-capable

---

## Phase 7: User Story 5 - Responsive Layout and Input Methods (Priority: P5)

**Goal**: Mobile tap zones and swipe; desktop keyboard; responsive layout; portrait lock; background/foreground pause.

**Independent Test**: Play on mobile (touch) and desktop (keyboard); layout responsive; pause on background.

### Implementation for User Story 5

- [X] T027 [US5] Ensure tap zones and swipe work on mobile in js/game/input.js
- [X] T028 [US5] Ensure keyboard (Arrow Left/Right, A/D) works on desktop in js/game/input.js
- [X] T029 [US5] Add responsive layout and portrait lock enforcement in css/main.css and index.html

**Checkpoint**: Cross-device compatibility verified

---

## Phase 8: User Story 6 - Sound Effects (Priority: P6)

**Goal**: Sound effects for movement, collision, collection; mute toggle on start screen and in-game.

**Independent Test**: Play with sound on (effects play); mute and play (game fully playable).

### Implementation for User Story 6

- [X] T030 [P] [US6] Implement audio module with Web Audio API in js/audio.js
- [X] T031 [US6] Add sound effects for movement, collision, collection in js/audio.js
- [X] T032 [US6] Add mute toggle on start screen and in-game; persist mute in js/storage.js

**Checkpoint**: Audio feedback with mute option

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [X] T033 [P] Run quickstart.md validation (serve, open, PWA install, offline)
- [X] T034 Code cleanup and ensure lint compliance per project rules

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
  - US1 (P1): No dependencies on other stories — MVP
  - US2 (P2): Depends on US1 (game over screen needs game)
  - US3 (P3): Depends on US1 (spawner exists)
  - US4 (P4): Can run after Foundational; integrates with existing app
  - US5 (P5): Depends on US1 (input exists); polish/validation
  - US6 (P6): Can run after US2 (mute on start screen)
- **Polish (Phase 9)**: Depends on desired user stories complete

### Within Each User Story

- Entities before collision/spawner
- Collision/spawner before game loop integration
- Input before playing state

### Parallel Opportunities

- T003, T006 can run in parallel within their phases
- T011, T012 can run in parallel (US1)
- T023, T030 can run in parallel (US4, US6)
- T033 can run in parallel with T034

---

## Parallel Example: User Story 1

```bash
# Launch entities and road together:
Task: "Create Motorcycle, Obstacle, Collectible entities in js/game/entities.js" (T011)
Task: "Implement road rendering and 3-lane layout in js/game/road.js" (T012)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test core gameplay independently
5. Demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Test → MVP playable
3. Add US2 → Test → Full session loop
4. Add US3 → Test → Difficulty curve
5. Add US4 → Test → PWA/offline
6. Add US5 → Test → Cross-device
7. Add US6 → Test → Sound
8. Polish → Final validation

### Suggested MVP Scope

- Phases 1–3 (Setup, Foundational, US1)
- Delivers: Playable core game with loading, basic start/play flow

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to user story for traceability
- Each user story independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No build step for MVP; static files served directly
