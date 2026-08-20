# Cinematic Web Framework 0.2.0

Version 0.2 reframes the existing source template as an agent-ready framework for cinematic, accessible, mobile-first development with LLM collaborators.

## What is new

- `cinematic.config.json` and a versioned JSON Schema make chapters, responsive strategy, motion limits, budgets, accessibility, and approved exceptions machine-readable.
- `cinematic:init`, `cinematic:check`, and `cinematic:context` provide safe non-interactive tooling for coding agents and CI.
- A portable `cinematic-web` skill, root agent contract, phase recipes, expanded templates, and two non-runnable reference packs make the workflow reusable across art directions.
- The live demo adds an accessible Context → Compose → Choreograph → Validate chapter and readable config example.
- Budget checks now consume project configuration; validation also checks context completeness and structural guardrails.

## Compatibility and migration

- The repository slug, Pages URL, template status, and source-first distribution remain unchanged.
- Every public export from `src/framework/index.ts` remains compatible with version 0.1.
- Existing clones can adopt the agent protocol by copying the root context templates and `cinematic.config.json`; runtime changes are not required.
- The package identity is now `cinematic-web-framework` version `0.2.0`, remains private, and is not published to npm.

## Boundaries

The framework intentionally does not include a runtime LLM SDK, prompt API, backend, database, email service, scheduler, deployment binding, or image provider. Connect those concerns through documented adapter boundaries.
