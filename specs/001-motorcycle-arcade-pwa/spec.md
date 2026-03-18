# Feature Specification: Neon Highway Motorcycle Arcade PWA

**Feature Branch**: `001-motorcycle-arcade-pwa`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: Retro-inspired pseudo-3D highway arcade game. Player controls a Harley-Davidson Shovelhead–inspired motorcycle with outlaw biker rider. Neon-lit city at night. Endless driving, avoid traffic, collect coins. Mobile-first PWA, landscape, touch controls.

## Core Concept

A retro-inspired pseudo-3D highway game (OutRun / 80s Overdrive style):

- Player controls a motorcycle (Harley-Davidson Shovelhead inspired)
- Rider: long-haired biker, outlaw / David Mann–style silhouette
- Road: cars, trucks, traffic
- Setting: neon-lit city/highway at night, skyline, lights, atmosphere
- Camera: fixed third-person behind the bike (pseudo-3D forward motion)

## Platform

- Mobile-first PWA (installable)
- Smooth on modern smartphones
- Landscape orientation
- Touch-first: tap left/right or swipe
- Desktop support for testing only

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Driving Loop (Priority: P1)

A player launches the game and drives forward on an endless pseudo-3D highway. They move left and right between lanes to avoid traffic (cars, trucks). Collision ends the game. Speed increases over time. Score is based on distance survived.

**Why this priority**: This is the core gameplay. Without it, there is no game.

**Independent Test**: Launch game, move motorcycle left/right, avoid at least one vehicle, survive until collision. Delivers the fundamental arcade experience.

**Acceptance Scenarios**:

1. **Given** the game is launched, **When** the player taps left/right or swipes, **Then** the motorcycle moves between lanes
2. **Given** the motorcycle is in a lane, **When** traffic spawns in that lane, **Then** the player can move to another lane to avoid it
3. **Given** the motorcycle collides with a vehicle, **When** collision is detected, **Then** the game ends
4. **Given** the game is running, **When** time passes, **Then** speed increases gradually
5. **Given** the game is running, **When** the player drives forward, **Then** score increases based on distance survived

---

### User Story 2 - Collect Coins (Priority: P2)

The player collects coins on the road. Coins add to the experience (displayed in HUD). Coins do not affect survival; they are a secondary objective.

**Why this priority**: Adds a simple collectible loop without complicating core survival.

**Independent Test**: Drive into a coin, verify coin count increases in HUD. Delivers a secondary goal.

**Acceptance Scenarios**:

1. **Given** a coin is on the road, **When** the motorcycle passes through it, **Then** the coin is collected and the coin count updates
2. **Given** coins are collected, **When** the game ends, **Then** the final coin count is displayed

---

### User Story 3 - Start, Game Over, Restart (Priority: P3)

The player sees a start screen when opening the game. After a collision, they see a game over screen with the option to restart.

**Why this priority**: Essential for a complete play session and replayability.

**Independent Test**: Open game (start screen), play until collision (game over), tap restart (game restarts). Delivers a complete session loop.

**Acceptance Scenarios**:

1. **Given** the game is opened, **When** the app loads, **Then** the start screen is displayed with a way to begin playing
2. **Given** the game has ended, **When** the game over screen is shown, **Then** the player's score (distance, coins) is displayed with a restart option
3. **Given** the game over screen is visible, **When** the player taps restart, **Then** the game restarts from the beginning

---

### User Story 4 - PWA Installability and Offline (Priority: P4)

The player can install the game as an app on their mobile device. Once installed, the game can be launched from the home screen and works offline after initial load.

**Why this priority**: Enables mobile-first distribution and offline play.

**Independent Test**: Visit in mobile browser, install, launch from home screen, play offline. Delivers installable, offline-capable experience.

**Acceptance Scenarios**:

1. **Given** the game is opened in a supporting browser, **When** the player chooses to install, **Then** the game is added to the home screen
2. **Given** the game was previously loaded, **When** the device is offline, **Then** the game can still be launched and played
3. **Given** the game is launched from the home screen, **When** it opens, **Then** it displays in a fullscreen-like layout

---

### User Story 5 - HUD and Feedback (Priority: P5)

The player sees a minimal arcade HUD: timer (MM:SS) top right; speed (KM/H) bottom right as the most prominent element; coins and distance bottom left. HUD is pixel/retro styled, readable on mobile.

**Why this priority**: Provides essential feedback without cluttering the screen.

**Independent Test**: Play and verify timer, speed, coins, and distance are visible and readable. Delivers clear feedback.

**Acceptance Scenarios**:

1. **Given** the game is running, **When** the player looks at the HUD, **Then** timer (MM:SS) is visible top right
2. **Given** the game is running, **When** the player looks at the HUD, **Then** speed (KM/H) is the most prominent element, bottom right
3. **Given** the game is running, **When** the player looks at the HUD, **Then** coins and distance are visible bottom left, stacked or grouped
4. **Given** the HUD is displayed, **When** viewed on mobile, **Then** it is readable and uses pixel/retro styled panels

---

### Edge Cases

- What happens when the player taps outside the game area? Input is ignored or handled gracefully.
- How does the game handle rapid input? Movement feels responsive; debouncing or throttling may apply.
- What happens when the device rotates? The game locks to landscape; rotation is handled without crashing.
- What happens when the game is backgrounded and resumed? The game pauses when backgrounded and resumes when foregrounded.
- What happens when the player opens the game offline for the first time? The game displays a clear offline message with a retry button.
- What happens when the screen is very small or very large? Layout remains responsive; game remains playable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST render a pseudo-3D road stretching into the horizon with strong parallax (road, traffic, skyline)
- **FR-002**: The game MUST display a motorcycle (Harley-Davidson Shovelhead inspired) with a long-haired biker rider (outlaw / David Mann silhouette), fixed third-person behind the bike
- **FR-003**: The game MUST allow the player to move the motorcycle left and right between lanes via touch (tap left/right or swipe) and keyboard (desktop testing)
- **FR-004**: The game MUST spawn traffic (cars, trucks) on the road; collision with any vehicle ends the game
- **FR-005**: The game MUST spawn collectible coins on the road; collection updates the coin count
- **FR-006**: The game MUST increase speed over time
- **FR-007**: The game MUST calculate score based on distance survived (coins displayed separately)
- **FR-008**: The game MUST display a neon-lit city/highway at night with skyline, lights, and atmosphere
- **FR-009**: The game MUST display a start screen with a way to begin playing
- **FR-010**: The game MUST display a game over screen with score (distance, coins) and restart option
- **FR-011**: The game MUST provide a web app manifest (manifest.json) for PWA installability
- **FR-012**: The game MUST use a service worker for offline support after initial load
- **FR-013**: The game MUST lock to landscape orientation
- **FR-014**: The game MUST display a HUD: timer (MM:SS) top right; speed (KM/H) bottom right as the most prominent element; coins and distance bottom left; pixel/retro styled panels
- **FR-015**: The game MUST pause when backgrounded and resume when foregrounded
- **FR-016**: The game MUST display an offline message with retry when opened offline before any prior load
- **FR-017**: The game MUST use JavaScript and HTML5 canvas; Phaser is optional
- **FR-018**: The game MUST use localStorage only if needed; no backend

### Key Entities

- **Player**: The human controlling the motorcycle. Interacts via touch or keyboard.
- **Motorcycle**: The controllable entity. Harley-Davidson Shovelhead inspired. Has position (lane), movement (left/right), collision bounds.
- **Rider**: Long-haired biker, outlaw / David Mann silhouette. Renders with the motorcycle.
- **Road**: Pseudo-3D endless highway. Parallax layers. Stretches into horizon.
- **Traffic**: Cars and trucks. Spawn on road. Collision ends game.
- **Coin**: Collectible. Adds to coin count. No effect on survival.
- **Score**: Distance survived. Displayed during play and on game over.
- **Game Session**: A single run from start to collision.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new player can go from opening the game to playing within 5 seconds
- **SC-002**: The game runs smoothly on typical mobile devices, targeting close to 60fps
- **SC-003**: A typical play session lasts 10–60 seconds before game over
- **SC-004**: The game loads and becomes playable in under 5 seconds on a typical mobile connection
- **SC-005**: The game can be installed as a PWA and launched from the home screen on supported mobile browsers
- **SC-006**: The game remains playable offline after it has been loaded at least once
- **SC-007**: Players can complete a full cycle (start → play → game over → restart) without leaving the app
- **SC-008**: Movement and collision feedback are perceptible within 100ms of player input or event

## Assumptions

- Placeholder or simple graphics are acceptable for MVP; polished assets come after gameplay is validated
- No backend, user accounts, or online features for MVP
- Desktop support is for testing only; mobile is primary
- Session storage or localStorage sufficient for any persistence; no backend
- Traffic uses simple spawn logic; exact distribution is not specified

## Out of Scope (MVP)

- Missions
- Multiplayer
- Online leaderboards
- Backend or accounts
- Complex physics
- Large progression systems
- Fuel meter
- Oil spills
- Roadblocks
- Rider selection
- Portrait orientation

## Visual Direction

- Retro pixel-art inspired
- Pseudo-3D road stretching into horizon
- Strong parallax (road, traffic, skyline)
- Neon/night city lighting
- Motorcycle must feel powerful and readable (not too small)
- Emphasis on motion, speed, and atmosphere

## Technical Constraints

- JavaScript + HTML5 canvas
- Phaser recommended but optional
- No backend
- localStorage only if needed
- PWA: manifest.json, service worker, installable experience

## Architecture Principles

- Gameplay-first
- Fast iteration over perfect structure
- Minimal dependencies
- No overengineering
- Code must be readable and modular
- Use placeholder assets until gameplay is proven

## Performance

- Target smooth gameplay on mobile (close to 60fps)
- Fast initial load
- Low asset weight
