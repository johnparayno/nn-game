<!--
Sync Impact Report
==================
Version change: 1.0.0 → 2.0.0
Modified principles: All replaced (Library-First, CLI, Test-First, Integration Testing, Observability → Mobile-First PWA, Touch & Performance, Gameplay First, PWA Essentials, Minimal Code, Placeholder Assets)
Added sections: Technical Decision Criteria (in Governance)
Removed sections: Library-First, CLI Interface, Integration Testing (library/CLI focus)
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Constitution Check gates updated
  - .specify/templates/spec-template.md: ✅ No mandatory section changes
  - .specify/templates/tasks-template.md: ✅ Task categorization compatible (PWA setup, game loop phases)
  - .cursor/commands/*.md: ✅ No agent-specific references requiring update
Follow-up TODOs: None
-->

# NN Game Constitution

## Core Principles

### I. Mobile-First PWA

Build a simple, installable arcade game for mobile browsers using lightweight web technologies. The game MUST be designed and implemented for mobile first; desktop support is secondary.

**Rationale**: Mobile browsers are the primary target. Installability and lightweight tech ensure reach and performance on constrained devices.

### II. Touch Controls & Performance

Prioritize touch controls, fast load times, smooth rendering, and short replayable sessions. Input MUST feel responsive; load MUST be minimal; sessions MUST support quick play-and-repeat cycles.

**Rationale**: Mobile players expect instant feedback and short bursts. Slow loads or laggy input kill retention.

### III. Gameplay First (NON-NEGOTIABLE)

Core gameplay MUST be fun before adding upgrades, missions, menus, or visual polish. No meta-progression, UI chrome, or cosmetic work until the moment-to-moment loop is validated as enjoyable.

**Rationale**: Fun is the product. Features built on weak core loop waste effort and obscure what matters.

### IV. PWA Essentials

Support PWA essentials: web app manifest, service worker, and home screen installation. The game MUST be installable and playable offline (or with graceful degradation) once installed.

**Rationale**: Installability drives engagement. Service worker enables caching and offline play for arcade sessions.

### V. Minimal Code, No Backend Unless Needed

Keep code modular but minimal. Avoid unnecessary dependencies. Do NOT introduce backend services unless they unlock a clear gameplay or product need.

**Rationale**: Every dependency and service adds latency, complexity, and failure modes. Mobile PWA thrives on simplicity.

### VI. Placeholder Assets Until Validated

Use placeholder assets until the core loop is validated. Art, sound, and polish come after gameplay is proven fun.

**Rationale**: Prevents sunk cost in assets for an unvalidated design. Enables rapid iteration on mechanics.

## Additional Constraints

- Technology stack MUST be lightweight web (HTML, CSS, JS; minimal frameworks).
- Performance goals MUST include load time, frame rate, and input latency targets.
- Dependencies MUST be justified; prefer vanilla or minimal libraries.

## Development Workflow

- Code review MUST verify constitution compliance.
- Each feature MUST have a spec, plan, and tasks before implementation.
- Complexity violations (e.g., adding backend, heavy framework) MUST be documented in plan Complexity Tracking table.

## Governance

This constitution supersedes all other practices. Amendments require documentation, approval rationale, and migration plan when principles change.

- All PRs and reviews MUST verify compliance with Core Principles.
- Every technical decision MUST support: speed, clarity, maintainability, and a better moment-to-moment player experience on mobile.
- Complexity MUST be justified in plan.md when deviating.
- Use `.specify/` documentation for runtime development guidance.

**Version**: 2.0.0 | **Ratified**: 2025-03-18 | **Last Amended**: 2025-03-18
