# Cinematic Web Framework

[![CI](https://github.com/evoltriet/cinematic-web-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/evoltriet/cinematic-web-starter/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-c3a15d.svg)](./LICENSE)

An agent-ready React and Motion framework for building cinematic web experiences with LLM collaborators—without surrendering design judgment, accessibility, performance, or project context.

**[View the live demo](https://evoltriet.github.io/cinematic-web-starter/)** · **[Read the agent workflow](./docs/AGENT-WORKFLOW.md)** · **[Explore the runtime](./src/framework/index.ts)**

This is source-first `v0.2.0`: clone it, shape it, and keep the code. It has no runtime model SDK, prompt API, backend, or provider lock-in, and it is not an npm package yet.

## Three framework layers

| Layer | What it provides |
| --- | --- |
| Cinematic runtime | Small React and Motion primitives for accessible openers, ink text, responsive media, depth, finite passages, local stories, navigation, tabs, and accordions |
| Agent development protocol | A versioned project contract, durable context, portable skill, phase recipes, initializer, and deterministic context packet |
| Quality gates | Structural, accessibility, performance, responsive, privacy, budget, browser, and release validation |

The framework treats LLM assistance as a development workflow, not a feature shipped to visitors. Agents can accelerate exploration and implementation, while configuration and durable context preserve the human decisions they must not improvise away.

## Quick start

Requires Node.js 22.13+ and pnpm.

```bash
git clone https://github.com/evoltriet/cinematic-web-starter.git
cd cinematic-web-starter
pnpm install
pnpm dev
```

Preview the framework-owned context in a cloned template, then intentionally reset it for your project:

```bash
pnpm cinematic:init -- --project "Night Garden" --dry-run
pnpm cinematic:init -- --project "Night Garden" --force
```

In a consumer copy without those root files yet, omit `--force`:

```bash
pnpm cinematic:init -- --project "Night Garden"
```

Source components and assets are never overwritten by the initializer.

## The agent contract

`cinematic.config.json` is the machine-readable experience contract. Its versioned [JSON Schema](./schemas/cinematic-config.schema.json) defines project identity, chapters, responsive strategy, motion limits, budgets, accessibility requirements, and approved exceptions.

Each chapter has one of four motion modes: `static`, `reveal`, `triggered-passage`, or `local-scroll-story`.

```json
{
  "schemaVersion": 1,
  "chapters": [
    {
      "id": "arrival",
      "title": "Arrival",
      "motionMode": "reveal",
      "composition": "full-bleed editorial hero",
      "decorativePlanes": 2
    }
  ],
  "motion": {
    "nativeScrolling": true,
    "globalScene": false,
    "pointerTracking": false,
    "maxDecorativePlanesPerChapter": 2,
    "maxLocalScrollStories": 1
  }
}
```

Agents must read config, project context, design context, assumptions, experience plan, and asset plan before planning or editing. The root [agent contract](./AGENTS.md) and portable [`cinematic-web` skill](./skills/cinematic-web/SKILL.md) enforce that order.

## Agent-friendly commands

```bash
# Validate config, context completeness, chapter limits, and structural guardrails
pnpm cinematic:check
pnpm cinematic:check -- --format json

# Emit a deterministic allowlisted packet; never reads .env or arbitrary files
pnpm cinematic:context -- --format markdown
pnpm cinematic:context -- --format json

# Run the complete local release gate
pnpm validate
pnpm test:browser
```

The tooling is non-interactive and provider-neutral. [Codex, Claude Code, Cursor, and similar agent setup](./docs/AGENT-WORKFLOW.md) all point to the same canonical repository files instead of maintaining incompatible prompts.

## Included runtime primitives

All public primitives remain exported from `src/framework/index.ts` and compatible with `v0.1`. They are ordinary editable source.

| Primitive | Purpose |
| --- | --- |
| `MotionProvider` | Lazy Motion loading, shared editorial easing, and reduced-motion policy |
| `CeremonialGate` | Accessible opener with Skip, Replay, focus restoration, scroll lock, and immediate entry |
| `InkRevealText` | Semantic live text with staggered word-level ink passes instead of bitmap lettering |
| `ResponsiveBackdrop` | Desktop/mobile art direction with explicit loading priority |
| `Reveal` | Small viewport entrance with an immediate reduced-motion result |
| `DepthScene` / `DepthPlane` | Contained perspective layers that cannot capture input |
| `TriggeredPassage` | Forward-running sequences that replay only after complete exit |
| `HorizontalStoryTrack` | One local vertical-to-horizontal chapter with a stacked fallback |
| `PageProgress` | Lightweight compositor-only progress |
| `ActiveSectionNav` | Intersection-driven navigation state |
| `AccessibleTabs` / `AccessibleAccordion` | Keyboard-complete disclosure patterns |

```tsx
import { CeremonialGate, InkRevealText, MotionProvider } from "./framework";

export function Experience() {
  return (
    <MotionProvider>
      <CeremonialGate enterLabel="Open the story">
        {({ cycle, replay }) => (
          <main>
            <InkRevealText cycle={cycle} duration={7} lines={["Make the", "story move"]} />
            <button onClick={replay}>Replay opening</button>
          </main>
        )}
      </CeremonialGate>
    </MotionProvider>
  );
}
```

## Operating principles

- Native scrolling stays authoritative.
- Motion belongs to a chapter, not one global scene.
- Mobile receives its own composition instead of a shrunken desktop.
- Semantic content and controls work before spectacle is added.
- Essential meaning never depends on animation, hover, or JavaScript timing.
- Forms and decision points remain visually quiet.
- Transform and opacity motion stays finite; `will-change` is temporary.
- Verified facts, assumptions, and design decisions survive agent sessions.
- Automated gates can enforce structure; human reviewers remain responsible for taste and cultural judgment.

## Customize the system

1. Set identity, chapters, limits, and budgets in `cinematic.config.json`.
2. Complete the durable root context files or initialize them from `docs/templates/`.
3. Change colors, type, spacing, depth, easing, duration, breakpoints, and safe-area variables in `src/styles/tokens.css`.
4. Replace the fictional CSS scenery in `src/styles/demo.css` with an approved asset plan while preserving reading surfaces.
5. Choose the least complex motion mode that serves each chapter.
6. Validate at desktop, tablet, 390px, 360px, and mobile landscape before release.

## Accessibility and performance

The demo supports semantic fallbacks, keyboard operation, focus restoration, 44px targets, 200% zoom-friendly layouts, WCAG AA contrast intent, and `prefers-reduced-motion`. CI reads JavaScript and CSS budgets from config; the default limits remain approximately 180 KB and 30 KB gzip. Lighthouse targets 90 performance and 95 accessibility and best practices.

See [Accessibility](./docs/ACCESSIBILITY.md), [Performance](./docs/PERFORMANCE.md), and the [browser QA checklist](./docs/checklists/BROWSER-QA.md).

## Reference project packs

Two non-runnable packs show how the same contract supports distinct art directions without copied imagery or provider-specific source:

- [Museum After Dark](./examples/museum-after-dark/) — an editorial cultural experience centered on provenance and quiet interpretation.
- [Field Camera Launch](./examples/field-camera-launch/) — a cinematic product story centered on material precision and static specifications.

## Backend and model boundaries

Forms can call any API, but persistence, authentication, email, scheduling, hosting, image generation, and model access remain adapter boundaries. Animated presentation never owns transaction state. See [Backend adapters](./docs/ADAPTERS.md).

## Documentation

- [Agent development workflow](./docs/AGENT-WORKFLOW.md)
- [End-to-end web/mobile playbook](./docs/PLAYBOOK.md)
- [Motion selection guide](./docs/MOTION-GUIDE.md)
- [Accessibility contract](./docs/ACCESSIBILITY.md)
- [Performance contract](./docs/PERFORMANCE.md)
- [Backend adapter boundaries](./docs/ADAPTERS.md)
- [Anonymous production case study](./docs/CASE-STUDY.md)
- [Templates](./docs/templates/)
- [Contribution guide](./CONTRIBUTING.md)

## Origin and privacy

The framework was distilled from an iterative real-world editorial experience built with LLM collaboration. The source project taught the lessons; none of its personal data, private URLs, generated artwork, backend workflows, credentials, or deployment configuration appears here.

## License

[MIT](./LICENSE). Motion and other dependencies retain their licenses; see [acknowledgements](./docs/ACKNOWLEDGEMENTS.md).
