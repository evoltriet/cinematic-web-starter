---
name: cinematic-web
description: Build or refine cinematic, accessible, mobile-first React experiences with durable agent context, bounded Motion choreography, responsive art direction, and automated quality gates. Use when planning, implementing, reviewing, or releasing an editorial or immersive web experience with LLM assistance, especially in a project that has cinematic.config.json or uses the Cinematic Web Framework.
---

# Cinematic Web

Use the framework as a collaboration protocol, not an aesthetic autopilot. Preserve human design judgment while making project truth and engineering limits legible to agents.

## Start with durable truth

Read in this order when present:

1. `cinematic.config.json`
2. `PROJECT_CONTEXT.md`
3. `DESIGN_CONTEXT.md`
4. `CONTENT_ASSUMPTIONS.md`
5. `EXPERIENCE_PLAN.md`
6. `ASSET_PLAN.md`
7. Repository-level agent instructions

Run `pnpm cinematic:context -- --format markdown` when the project supplies it. Do not read environment files or invent missing facts. Separate verified decisions, assumptions, and backlog before proposing changes.

## Follow the eight phases

1. **Discover:** identify audience, primary action, first-viewport promise, stable interfaces, and unresolved facts.
2. **Contract:** define information architecture and give every chapter one job and one motion mode.
3. **Art-direct:** lock exact tokens, cultural or product anchors, composition rules, and anti-patterns.
4. **Plan assets:** specify desktop and mobile composition, dimensions, loading, ownership, and provenance before generating or sourcing media.
5. **Select motion:** choose `static`, `reveal`, `triggered-passage`, or `local-scroll-story`; use the least complex mode that conveys meaning.
6. **Implement semantics:** build reading order, content, controls, focus, and fallback states before decorative animation.
7. **Validate:** run structural, responsive, accessibility, performance, privacy, and interaction gates at representative viewports.
8. **Release:** update durable context and QA evidence, document exceptions, and publish only after gates pass.

Read [workflow.md](references/workflow.md) for phase inputs, outputs, stop conditions, and acceptance checks. Read [quality-gates.md](references/quality-gates.md) before implementation review or release.

## Enforce the motion contract

- Keep native scrolling authoritative.
- Avoid a single global scene and continuous pointer tracking by default.
- Use transforms and opacity for finite chapter-local motion.
- Keep forms and consequential actions static while in use.
- Protect reading surfaces from decorative occlusion.
- Art-direct mobile rather than scaling down desktop.
- Make reduced motion a complete static composition, not missing content.

## Maintain context

Update the project context when verified truth changes, design context when the visual language changes, assumptions when provisional content changes, and experience or asset plans when chapter or media decisions change. Record exceptions in the machine-readable config with rule, rationale, and human approver.

## Stop when needed

Pause and report the conflict when requested spectacle would break semantic order, keyboard access, contrast, reduced motion, mobile usability, performance budgets, privacy, stable public interfaces, or asset rights. Do not silently weaken a gate or convert an assumption into fact.
