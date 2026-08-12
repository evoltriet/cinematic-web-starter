# Cinematic Web Starter

[![CI](https://github.com/evoltriet/cinematic-web-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/evoltriet/cinematic-web-starter/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-c3a15d.svg)](./LICENSE)

A cloneable React + Motion starter for cinematic editorial websites that remain fast, accessible, and genuinely mobile-first.

**[View the live demo](https://evoltriet.github.io/cinematic-web-starter/)** · **[Read the playbook](./docs/PLAYBOOK.md)**

## Why this exists

Cinematic sites often begin beautifully and end with scroll lag, unreadable mobile layouts, or interactions that disappear for keyboard and reduced-motion users. This starter turns hard-won production lessons into a small set of editable primitives and operating rules.

- Native scrolling stays authoritative.
- Motion belongs to a section, not a global scene.
- Mobile receives its own composition instead of a shrunken desktop.
- Essential content never depends on animation, hover, or JavaScript timing.
- Forms and decision points remain visually quiet.
- Context, assumptions, and design decisions survive across agent sessions.

## Quick start

Requires Node.js 22.13+ and pnpm.

```bash
git clone https://github.com/evoltriet/cinematic-web-starter.git
cd cinematic-web-starter
pnpm install
pnpm dev
```

Run the complete local validation gate:

```bash
pnpm validate
pnpm test:browser
```

## Included primitives

All public primitives are exported from `src/framework/index.ts` and remain ordinary editable source—this is intentionally not an npm package yet.

| Primitive | Purpose |
| --- | --- |
| `MotionProvider` | Lazy Motion loading, shared editorial easing, and user reduced-motion policy |
| `CeremonialGate` | Accessible opener with Skip, Replay, focus restoration, scroll lock, and immediate entry |
| `InkRevealText` | Crisp semantic text with staggered handwriting-like ink passes; no GIF or video |
| `ResponsiveBackdrop` | Desktop/mobile art direction with explicit loading priority |
| `Reveal` | Small viewport entrance with an immediate reduced-motion result |
| `DepthScene` / `DepthPlane` | Contained perspective layers that cannot capture input |
| `TriggeredPassage` | Forward-running viewport sequences that can replay after complete exit |
| `HorizontalStoryTrack` | One local vertical-to-horizontal chapter with a stacked fallback |
| `PageProgress` | Lightweight compositor-only progress |
| `ActiveSectionNav` | Intersection-driven navigation state |
| `AccessibleTabs` / `AccessibleAccordion` | Keyboard-complete disclosure examples |

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

## Customize the system

1. Change colors, type, spacing, depth, easing, durations, gutters, and safe-area variables in `src/styles/tokens.css`.
2. Replace the fictional CSS scenery in `src/styles/demo.css` with your art direction. Keep content surfaces and reading order intact.
3. Choose one motion mode per chapter using the [motion decision guide](./docs/MOTION-GUIDE.md).
4. Fill the templates in `docs/templates/` before major implementation begins.
5. Use the [implementation](./docs/checklists/IMPLEMENTATION.md) and [browser QA](./docs/checklists/BROWSER-QA.md) checklists before release.

## Accessibility and performance

The demo supports keyboard navigation, semantic fallbacks, focus restoration, 44px targets, 200% zoom-friendly layouts, and `prefers-reduced-motion`. CI enforces approximately 180 KB gzip for initial JavaScript and 30 KB gzip for CSS. See [Accessibility](./docs/ACCESSIBILITY.md) and [Performance](./docs/PERFORMANCE.md).

## Backends and deployment

This repository deliberately stops at a frontend adapter boundary. Forms can call any API; persistence, email, scheduling, and authentication must remain outside animation components. See [Backend adapters](./docs/ADAPTERS.md).

The static demo deploys to GitHub Pages from `main`. The starter itself works with any Vite-compatible static host and can be embedded in larger React systems.

## Documentation

- [End-to-end web/mobile playbook](./docs/PLAYBOOK.md)
- [Motion selection guide](./docs/MOTION-GUIDE.md)
- [Accessibility contract](./docs/ACCESSIBILITY.md)
- [Performance contract](./docs/PERFORMANCE.md)
- [Backend adapter boundaries](./docs/ADAPTERS.md)
- [Anonymous production case study](./docs/CASE-STUDY.md)
- [Contribution guide](./CONTRIBUTING.md)

## Origin and privacy

This framework was distilled from an iterative, real-world editorial experience. The source project taught the lessons; none of its personal data, names, URLs, generated artwork, backend workflows, or deployment configuration appears here.

## License

[MIT](./LICENSE). Motion and other dependencies retain their respective licenses; see [acknowledgements](./docs/ACKNOWLEDGEMENTS.md).
