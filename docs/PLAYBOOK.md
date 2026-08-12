# Web/Mobile Experience Playbook

This is the repeatable workflow behind the starter. Move through it in order; animation code is deliberately not the first step.

## 1. Establish durable truth

Write a project context before planning implementation. Separate verified facts, current behavior, design direction, assumptions, unresolved decisions, and backlog. Require future agents and contributors to read it.

The templates in `docs/templates/` prevent confident placeholder copy from silently becoming project truth.

## 2. Define the experience contract

State the audience, first-viewport promise, information hierarchy, primary action, supported devices, accessibility requirements, performance budgets, and forbidden techniques. Treat mobile as a first-class composition from the beginning.

## 3. Build the design system

Lock a small token set for color, typography, spacing, geometry, depth, easing, and duration. Record design references as references—not dependencies—unless their source and license are reviewed.

## 4. Plan assets around composition

Art-direct separate desktop and mobile crops. Identify background, midground, and foreground responsibilities before creating assets. Prefer one responsive background and no more than two active decorative planes per chapter. Reserve dimensions to eliminate layout shift.

## 5. Assign one motion mode per section

- **Entrance:** content becomes present once.
- **Triggered passage:** a finite object crosses the viewport forward and may replay after fully exiting.
- **Local scroll story:** a single chapter maps native scroll progress to a contained visual transformation.
- **Static:** forms, dense information, and important decisions.

Never introduce a global animated world merely to connect otherwise independent chapters.

## 6. Implement content before spectacle

Render complete semantic content first. Add keyboard behavior, focus management, touch targets, and reduced-motion outcomes. Then add motion with transforms and opacity. Decorative layers are `aria-hidden`, non-interactive, and unable to obscure controls permanently.

## 7. Validate continuously

Check desktop, tablet, narrow mobile, smaller mobile, and mobile landscape. Test native wheel/touch/keyboard scrolling, anchors, rapid scroll, slow media, JavaScript fallback, reduced motion, and 200% text zoom. Measure built assets instead of reasoning from source size.

## 8. Release through gates

Require lint, types, unit tests, build, budgets, sanitization, and browser smoke tests. Publish exact validated source. Keep operational activation—domains, credentials, schedulers, imports—on an explicit checklist rather than hiding it in prose.
