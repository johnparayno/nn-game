# NN Game Constitution

## Core Principles

### I. Mobile-First PWA

The game MUST be a mobile-first Progressive Web App: installable, touch-first, landscape orientation. Desktop support is for testing only.

**Rationale**: The target experience is arcade play on smartphones. PWA enables distribution without app stores and offline play after initial load.

### II. Gameplay-First (NON-NEGOTIABLE)

Validate the core loop before meta-features. One polished loop: drive, avoid traffic, collect coins, survive. No missions, multiplayer, or backend.

**Rationale**: Fun is the product. Features built on a weak core loop waste effort. Validate moment-to-moment experience first.

### III. Plain JavaScript & HTML5 Canvas

Use JavaScript and HTML5 canvas. Phaser is optional. No backend. localStorage only if needed. No overengineering.

**Rationale**: Lightweight stack, fast load, readable code. Minimal dependencies keep iteration fast.

### IV. Minimal Complexity

Avoid overengineering, heavy frameworks, and unnecessary systems. Every dependency MUST be justified by clear gameplay need.

**Rationale**: Arcade games thrive on simplicity. Complexity adds latency and slows iteration.

### V. Clean, Modular Code

Code MUST be readable and modular. Structure around game states, entities, and reusable mechanics. Fast iteration over perfect structure.

**Rationale**: Rapid iteration requires code that can be changed quickly without breaking unrelated systems.

### VI. Placeholder Assets Until Validated

Temporary assets are acceptable until gameplay feel is right. Art and polish come after core mechanics are proven fun.

**Rationale**: Prevents sunk cost in assets for unvalidated design. Enables rapid iteration on mechanics.

## Additional Constraints

- Technology MUST be lightweight web: HTML, CSS, JS, HTML5 canvas.
- Performance MUST target smooth mobile gameplay (close to 60fps), fast initial load, low asset weight.
- PWA MUST include manifest.json, service worker, and installable experience.
- Dependencies MUST be justified; prefer vanilla or minimal libraries.

## Development Workflow

- Code review MUST verify constitution compliance.
- Each feature MUST have a spec, plan, and tasks before implementation.
- Complexity violations MUST be documented when deviating.

## Governance

This constitution supersedes all other practices. Amendments require documentation, approval rationale, and migration plan.

- All PRs and reviews MUST verify compliance with Core Principles.
- Every technical decision MUST support: fun, speed of iteration, clarity, maintainability.
- Fun, speed, and iteration matter more than technical perfection. Ship, learn, iterate.
- Use `.specify/` documentation for runtime development guidance.

**Version**: 4.0.0 | **Ratified**: 2026-03-19 | **Last Amended**: 2026-03-19
