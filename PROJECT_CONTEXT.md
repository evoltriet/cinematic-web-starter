# Project Context

Last updated: 2026-08-20

## North star

Cinematic Web Framework helps designers, frontend engineers, and coding agents create expressive React experiences with durable project truth, bounded Motion choreography, strong mobile art direction, and automated quality gates.

## Verified facts

- The public product name is Cinematic Web Framework.
- The repository slug and GitHub Pages path remain `evoltriet/cinematic-web-starter`.
- Version 0.2.0 is source-first, private in package metadata, and not published to npm.
- React 19, TypeScript, Vite, Motion, semantic HTML, and plain tokenized CSS are the supported stack.
- Existing exports from `src/framework/index.ts` remain compatible in this release.

## Product contract

- The framework has three layers: cinematic runtime, agent development protocol, and quality gates.
- Projects declare identity, chapters, motion modes, limits, budgets, accessibility requirements, and approved exceptions in `cinematic.config.json`.
- Agent tooling must be deterministic, non-interactive, provider-neutral, and secret-safe.
- The demo must remain accessible, mobile-first, within configured budgets, and deployable as a static GitHub Pages site.

## Current implementation

- The runtime exports accessible opener, ink text, responsive backdrop, reveal, depth, triggered passage, local story, progress, navigation, tabs, and accordion primitives.
- The demo is a fictional CSS-only cinematic field guide with no third-party imagery.
- CI runs structural checks, lint, types, unit tests, production build, budgets, sanitization, browser checks, and Lighthouse.
- GitHub Pages publishes from the existing repository and URL.

## Approved design direction

- Editorial, atmospheric, tactile, and restrained rather than game-like.
- Native scroll is authoritative; motion is finite and chapter-local.
- Mobile composition is authored independently where needed.
- Reading surfaces protect contrast, forms remain static, and reduced motion yields a complete composition.

## Assumptions and backlog

- The assumptions ledger is `CONTENT_ASSUMPTIONS.md`.
- npm extraction remains deferred until external use validates the configuration and component APIs.
- Backend adapters, authentication, persistence, email, hosting, model APIs, and image generation remain documented boundaries.

## Change protocol

- Update this document when durable product truth changes.
- Never promote an assumption without explicit human confirmation.
- Update configuration, design context, experience plan, asset plan, and QA evidence when their contracts change.
