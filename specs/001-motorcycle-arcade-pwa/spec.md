# Feature Specification: Motorcycle Arcade PWA Game

**Feature Branch**: `001-motorcycle-arcade-pwa`  
**Created**: 2025-03-18  
**Status**: Draft  
**Input**: User description: "Build a mobile-first PWA arcade game where the player controls a motorcycle riding forward on an endless road. The core gameplay loop is to avoid obstacles, collect rewards, and survive as long as possible while speed gradually increases."

## Clarifications

### Session 2025-03-18

- Q: How many lanes should the endless road have? → A: 3 lanes
- Q: What should the player see while the game is loading (before it becomes playable)? → A: Splash/loading screen with progress indicator
- Q: Should the high score persist across browser sessions (e.g., after closing and reopening the app)? → A: Session only — high score resets when the tab/app is closed
- Q: When the game is backgrounded (e.g., user switches apps or locks the phone) and then resumed, what should happen? → A: Pause automatically — game pauses when backgrounded, resumes when foregrounded
- Q: Should the MVP include any accessibility support (e.g., reduced motion, screen reader hints)? → A: Skip for MVP — no accessibility features; add later
- Q: For mobile touch controls, which input method(s) should the MVP support? → A: Both tap zones and swipe — player can use either
- Q: Should the MVP include sound effects (with a mute option), or ship without sound? → A: Include sound with mute — implement effects and a mute toggle
- Q: When a user opens the game for the first time while offline (never loaded it before), what should they see? → A: Message with retry — explain offline, offer retry button
- Q: Should the game support both portrait and landscape, or lock to one orientation? → A: Portrait only — lock to portrait
- Q: For collectibles, should the MVP include both coins and fuel, and what should each do? → A: Both — coins add score, fuel extends survival (e.g., fuel meter)
- Q: Do all obstacle types (cars, roadblocks, oil spills) cause instant game over on collision, or does oil behave differently? → A: Oil different — oil causes slip/slide or temporary penalty; cars/roadblocks = instant game over
- Q: Where should the mute toggle appear? → A: Both — start screen and in-game
- Q: How should the displayed score be calculated? → A: Distance + coins — single score combining both
- Q: Where should the session high score be shown? → A: Both — start screen and game over screen
- Q: How should difficulty increase over time? → A: Spawn rate only — obstacles spawn more frequently over time

### Session 4 - Look & Feel (2025-03-18)

- Q: Can the user select different riders? → A: Yes — user can select between 3 different riders
- Q: How is the game screen laid out in portrait? → A: Portrait view with motorcycle anchored at the bottom of the screen

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start and Play Core Game (Priority: P1)

A player opens the game and immediately begins playing. They control a motorcycle moving forward on an endless road with 3 lanes. The player moves left and right to avoid obstacles (cars, roadblocks, oil spills) and collect rewards (coins add score; fuel extends survival via a fuel meter). Collision with cars or roadblocks ends the game; oil spills cause slip/slide or temporary penalty. Fuel depletion also ends the game. The player sees a single score combining distance survived and coins collected.

**Why this priority**: This is the core gameplay loop. Without it, there is no game.

**Independent Test**: Can be fully tested by launching the game, moving the motorcycle, avoiding at least one obstacle, collecting at least one item, and triggering a collision. Delivers the fundamental arcade experience.

**Acceptance Scenarios**:

1. **Given** the game is launched, **When** the player taps or swipes (mobile) or uses keyboard (desktop), **Then** the motorcycle moves left or right between lanes
2. **Given** the motorcycle is in a lane, **When** an obstacle spawns in that lane, **Then** the player can move to another lane to avoid it
3. **Given** the motorcycle collides with a car or roadblock, or fuel reaches zero, **When** the condition is detected, **Then** the game ends and the game over screen is shown
4. **Given** the motorcycle hits an oil spill, **When** contact occurs, **Then** a slip/slide or temporary penalty is applied (no instant game over)
5. **Given** the motorcycle passes a collectible (coin or fuel), **When** the player moves into the same lane, **Then** the item is collected — coins add to score, fuel refills the fuel meter
6. **Given** the game is running, **When** time passes or coins are collected, **Then** the road scrolls endlessly and the single score updates (distance + coins)

---

### User Story 2 - Start Screen and Restart Flow (Priority: P2)

A player sees a start screen when opening the game. After a game over, they see a game over screen with the option to restart. Restarting returns them to the core gameplay without leaving the app.

**Why this priority**: Essential for a complete play session and replayability. Players need a clear entry point and a way to try again.

**Independent Test**: Can be fully tested by opening the game (start screen appears), starting a game, ending the game (game over screen appears), and tapping restart (game restarts). Delivers a complete session loop.

**Acceptance Scenarios**:

1. **Given** the game is opened, **When** the app loads, **Then** the start screen is displayed with rider selection (3 options), a way to begin playing, and the session high score
2. **Given** the game has ended, **When** the game over screen is shown, **Then** the player's final score (distance + coins) and session high score are displayed
3. **Given** the game over screen is visible, **When** the player taps restart, **Then** the game restarts from the beginning with a fresh run

---

### User Story 3 - Increasing Difficulty (Priority: P3)

As the player survives longer, the game becomes harder. Obstacles spawn more frequently over time (scroll speed remains constant). This creates a natural difficulty curve that rewards skill and keeps sessions short (typically 10–60 seconds).

**Why this priority**: Drives the "survive as long as possible" loop and creates tension. Without it, the game would feel flat.

**Independent Test**: Can be fully tested by surviving for an extended period and observing that obstacle spawn rate increases over time. Delivers escalating challenge.

**Acceptance Scenarios**:

1. **Given** the game is running, **When** the player survives for a period of time, **Then** the obstacle spawn rate increases gradually
2. **Given** increasing spawn rate, **When** the player continues playing, **Then** the game remains playable and responsive (no performance degradation)

---

### User Story 4 - PWA Installability and Offline Support (Priority: P4)

A player can install the game as an app on their mobile device from the browser. Once installed, the game can be launched from the home screen and works offline for basic play. The experience feels like a native app (fullscreen-like, responsive layout).

**Why this priority**: Enables mobile-first distribution and offline play. Core to the PWA value proposition.

**Independent Test**: Can be fully tested by visiting the game in a mobile browser, installing it, launching from home screen, and playing while offline. Delivers installable, offline-capable experience.

**Acceptance Scenarios**:

1. **Given** the game is opened in a supporting browser, **When** the player chooses to install, **Then** the game is added to the home screen and can be launched like an app
2. **Given** the game was previously loaded, **When** the device is offline, **Then** the game can still be launched and played
3. **Given** the game is launched from the home screen, **When** it opens, **Then** it displays in a fullscreen-like layout optimized for mobile screens

---

### User Story 5 - Responsive Layout and Input Methods (Priority: P5)

The game adapts to mobile and desktop screens. On mobile, both tap zones and swipe are supported; the player can use either. On desktop, keyboard input is available for testing. The layout is responsive and optimized for mobile-first use.

**Why this priority**: Ensures the game works across devices and input methods. Touch is primary; keyboard supports development and desktop play.

**Independent Test**: Can be fully tested by playing on a mobile device with touch and on desktop with keyboard. Delivers cross-device compatibility.

**Acceptance Scenarios**:

1. **Given** the player is on a mobile device, **When** they use tap zones or swipe (left/right), **Then** the motorcycle moves left or right accordingly
2. **Given** the player is on desktop, **When** they use keyboard keys (e.g., arrow keys), **Then** the motorcycle moves left or right
3. **Given** the game is viewed on different screen sizes, **When** the layout renders, **Then** it is responsive and playable without horizontal scrolling or cut-off content
4. **Given** the game is running, **When** the app is backgrounded (e.g., user switches apps), **Then** the game pauses; **When** the app is foregrounded, **Then** the game resumes

---

### User Story 6 - Sound Effects (Priority: P6)

The game provides simple sound effects for key events (e.g., movement, collision, collection) with a mute toggle. When muted, the game remains fully playable.

**Why this priority**: Enhances game feel; mute ensures players can disable audio as needed.

**Independent Test**: Can be fully tested by playing and verifying that sound plays for movement, collision, and collection (if implemented). Delivers audio feedback.

**Acceptance Scenarios**:

1. **Given** sound is enabled, **When** the player moves or collides or collects an item, **Then** an appropriate sound effect plays
2. **Given** sound is muted, **When** the player plays, **Then** the game remains fully playable

---

### Edge Cases

- What happens when the player taps outside the game area? Input should be ignored or handled gracefully; no unintended actions.
- How does the game handle rapid input (e.g., rapid swipes or key presses)? Movement should feel responsive but not erratic; debouncing or input throttling may apply.
- What happens when the device rotates mid-game? The game is locked to portrait orientation; rotation is handled without crashing (e.g., maintain portrait or show orientation prompt).
- What happens when the game is backgrounded and resumed? The game MUST pause automatically when backgrounded and resume when foregrounded; it should not crash.
- What happens when the player has no network and has never loaded the game? The game MUST display a clear offline message explaining that an initial load is required, with a retry button.
- What happens when the screen is very small or very large? Layout remains responsive; game remains playable with appropriate scaling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST display an endless scrolling road with 3 lanes in a top-down perspective. In portrait, the motorcycle is anchored at the bottom of the screen; the road scrolls upward toward the player.
- **FR-002**: The game MUST allow the player to control a motorcycle that moves left and right between lanes
- **FR-003**: The game MUST support both tap zones and swipe for mobile touch input, and keyboard input for desktop
- **FR-004**: The game MUST spawn obstacles randomly (cars, roadblocks, oil spills) in the lanes. Cars and roadblocks cause instant game over on collision; oil spills cause slip/slide or temporary penalty
- **FR-005**: The game MUST detect collisions between the motorcycle and obstacles: cars and roadblocks cause instant game over; oil spills cause slip/slide or temporary penalty. Game also ends when the fuel meter reaches zero
- **FR-006**: The game MUST display a single score combining distance survived and coins collected
- **FR-007**: The game MUST include collectible items: coins (add to score) and fuel (extend survival via a fuel meter)
- **FR-008**: The game MUST increase difficulty over time by spawning obstacles more frequently (spawn rate only; scroll speed remains constant)
- **FR-009**: The game MUST display a start screen with rider selection (3 options), a way to begin playing, and the session high score
- **FR-010**: The game MUST display a game over screen with the final score, session high score, and a restart option
- **FR-011**: The game MUST provide a web app manifest so it can be installed as a PWA
- **FR-012**: The game MUST use a service worker to support basic offline play after initial load
- **FR-020**: When opened offline before any prior load, the game MUST display a clear offline message with a retry button
- **FR-013**: The game MUST use a responsive layout optimized for mobile screens and lock to portrait orientation
- **FR-014**: The game MUST support a fullscreen-like experience when launched from the home screen
- **FR-015**: The game MUST provide clear feedback on movement and collisions
- **FR-016**: The game MUST persist state locally only (session storage); no backend or accounts required for MVP. High score resets when the tab/app is closed.
- **FR-017**: The game MUST include simple sound effects for movement, collision, and collection, with a mute toggle on both the start screen and in-game
- **FR-018**: The game MUST display a splash/loading screen with a progress indicator while assets load, before the start screen is shown
- **FR-019**: The game MUST pause automatically when backgrounded (visibility hidden) and resume when foregrounded
- **FR-021**: The game MUST allow the player to select 1 of 3 riders on the start screen before playing

### Key Entities

- **Player**: The human controlling the motorcycle. Interacts via touch or keyboard.
- **Motorcycle**: The controllable entity. Has position (lane), movement (left/right), collision bounds, and rider skin (1 of 3 selectable).
- **Road**: The endless scrolling environment. Has 3 lanes and scrolls forward.
- **Obstacle**: Cars and roadblocks cause instant game over on collision. Oil spills cause slip/slide or temporary penalty (e.g., loss of control) rather than instant game over. All spawn randomly, have position and collision bounds.
- **Collectible**: Coins add to score; fuel extends survival (refills fuel meter). Both spawn randomly, have position and collision bounds.
- **Score**: Single numeric value combining distance survived and coins collected. Displayed during play and on game over.
- **Fuel Meter**: Depletes over time; fuel collectibles refill it. Game over when fuel reaches zero (in addition to collision).
- **Game Session**: A single run from start to game over. Has start time, end time, and final score.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new player can go from opening the game to playing within 5 seconds (low friction, minimal menus)
- **SC-002**: The game runs smoothly on typical mobile devices, targeting 60fps where the device supports it
- **SC-003**: A typical play session lasts 10–60 seconds before game over
- **SC-004**: The game loads and becomes playable in under 5 seconds on a typical mobile connection
- **SC-005**: The game can be installed as a PWA and launched from the home screen on supported mobile browsers
- **SC-006**: The game remains playable offline after it has been loaded at least once
- **SC-007**: Players can complete a full cycle (start → play → game over → restart) without leaving the app
- **SC-008**: Movement and collision feedback are perceptible within 100ms of player input or event

## Assumptions

- Placeholder or simple graphics are acceptable for MVP; polished assets are not required
- No backend, user accounts, or online features are required for MVP
- Sound effects are included with a mute toggle; the game remains playable when muted
- The game targets modern mobile browsers that support PWA features (manifest, service worker)
- Desktop support is primarily for development and testing; mobile is the primary platform
- Session storage is used for high score or simple persistence; high score does not persist across sessions
- Obstacle and collectible spawn logic uses randomness; exact distribution is not specified

## Out of Scope (MVP)

- Accessibility features (reduced motion, screen reader support) — add in future iterations
- Multiplayer
- Complex progression systems (unlockables, missions, challenges)
- Online leaderboards
- Advanced physics simulation
- User accounts or authentication
- Power-ups (nitro, shield, slow motion) — considered for future extensions
- Cosmetic upgrades — considered for future extensions

## Look & Feel

- **Layout**: Portrait orientation. Motorcycle anchored at the bottom of the screen; road scrolls upward. Top-down perspective.
- **Rider selection**: Player can choose from 3 different riders on the start screen. Selection applies to the motorcycle appearance for that session.
