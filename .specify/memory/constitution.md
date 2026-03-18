<!--
Sync Impact Report
==================
Version change: 2.0.0 → 3.0.0
Modified principles: All replaced (Mobile-First PWA, Touch & Performance, Gameplay First, PWA Essentials, Minimal Code, Placeholder Assets → Arcade-First Philosophy, Plain JavaScript & Canvas, Core Loop First, Minimal Complexity, Clean Changeable Code, Placeholder Assets Until Validated)
Added sections: Fun/Speed/Iteration in Governance
Removed sections: PWA Essentials, Mobile-First PWA (shift to general browser/arcade focus)
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Constitution Check gates updated
  - .specify/templates/spec-template.md: ✅ No mandatory section changes
  - .specify/templates/tasks-template.md: ✅ Task categorization compatible (game loop, entities, mechanics)
  - .cursor/commands/*.md: ✅ No agent-specific references requiring update
Follow-up TODOs: None
-->

# NN Game Constitution

## Core Principles

### I. Arcade-First Philosophy

Build a fast, accessible browser experience with simple controls, immediate feedback, and short play sessions. The game MUST prioritize quick access, responsive input, and replayable bursts over long-form content.

**Rationale**: Arcade games thrive on instant gratification and pick-up-and-play. Slow loads, complex controls, or long sessions undermine the core appeal.

### II. Plain JavaScript & HTML5 Canvas

Use plain JavaScript and HTML5 canvas unless a framework clearly speeds up development. Do NOT introduce frameworks without clear development velocity justification.

**Rationale**: Vanilla web tech keeps the stack lightweight, load times minimal, and code understandable. Frameworks add complexity; they are acceptable only when they demonstrably accelerate iteration.

### III. Core Loop First (NON-NEGOTIABLE)

Focus on one polished core loop before introducing menus, upgrades, missions, or cosmetic features. Core gameplay MUST be validated as fun before meta-progression or UI chrome.

**Rationale**: Fun is the product. Features built on a weak core loop waste effort and obscure what matters. Validate the moment-to-moment experience first.

### IV. Minimal Complexity

Avoid overengineering, heavy frameworks, and unnecessary backend complexity. Every dependency and service MUST be justified by a clear gameplay or product need.

**Rationale**: Every dependency and service adds latency, complexity, and failure modes. Arcade games thrive on simplicity and fast iteration.

### V. Clean, Changeable Code

Code MUST be easy to understand, easy to change, and structured around game states, entities, and reusable mechanics.

**Rationale**: Rapid iteration requires code that can be modified quickly without fear of breaking unrelated systems. Clear structure (states, entities, mechanics) supports this.

### VI. Placeholder Assets Until Validated

Temporary assets are acceptable until the game feel is right. Art, sound, and polish come after core mechanics are proven fun.

**Rationale**: Prevents sunk cost in assets for an unvalidated design. Enables rapid iteration on mechanics without visual lock-in.

## Additional Constraints

- Technology stack MUST be lightweight web (HTML, CSS, JS; HTML5 canvas; minimal or no frameworks).
- Performance goals MUST include load time, frame rate, and input latency targets.
- Dependencies MUST be justified; prefer vanilla or minimal libraries.
- Code structure MUST center on game states, entities, and reusable mechanics.

## Development Workflow

- Code review MUST verify constitution compliance.
- Each feature MUST have a spec, plan, and tasks before implementation.
- Complexity violations (e.g., adding backend, heavy framework) MUST be documented in plan Complexity Tracking table.

## Governance

This constitution supersedes all other practices. Amendments require documentation, approval rationale, and migration plan when principles change.

- All PRs and reviews MUST verify compliance with Core Principles.
- Every technical decision MUST support: fun, speed of iteration, clarity, and maintainability.
- Fun, speed, and iteration matter more than technical perfection. Ship, learn, iterate.
- Complexity MUST be justified in plan.md when deviating.
- Use `.specify/` documentation for runtime development guidance.

**Version**: 3.0.0 | **Ratified**: 2025-03-18 | **Last Amended**: 2025-03-18
