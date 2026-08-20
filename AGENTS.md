# Agent Contract

Before planning or editing, read these files in order:

1. `cinematic.config.json`
2. `PROJECT_CONTEXT.md`
3. `DESIGN_CONTEXT.md`
4. `CONTENT_ASSUMPTIONS.md`
5. `EXPERIENCE_PLAN.md`
6. `ASSET_PLAN.md`

Run `pnpm cinematic:context -- --format markdown` when a compact, deterministic context packet is useful.

## Working rules

- Preserve every export from `src/framework/index.ts` unless a breaking release is explicitly approved.
- Keep native scrolling authoritative. Do not add a global scene, scroll hijacking, continuous pointer tracking, or another animation runtime.
- Implement semantic content and keyboard behavior before decorative motion.
- Art-direct mobile; do not merely shrink the desktop composition.
- Keep forms and consequential actions visually quiet.
- Treat `cinematic.config.json` as the machine-readable contract. Record any approved exception there with rationale and approver.
- Keep verified decisions separate from assumptions. Update durable context when project truth changes.
- Do not add runtime model APIs, provider-specific agent dependencies, secrets, or backend services to the framework.
- Run `pnpm validate` and the relevant browser checks before release.

## Change discipline

Use the smallest motion mode that serves each chapter: `static`, `reveal`, `triggered-passage`, or `local-scroll-story`. Stay within configured asset and scene limits. If a request conflicts with an accessibility, privacy, or performance gate, stop and explain the conflict rather than silently weakening the gate.
