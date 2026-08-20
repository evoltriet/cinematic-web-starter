# Performance Contract

## Budgets

- Initial JavaScript and CSS limits come from `cinematic.config.json` (defaults: approximately 180 KB and 30 KB gzip).
- Eager media: first viewport only.
- Active scenic planes: one background plus no more than two foreground/midground planes per chapter.

## Rules

- Animate transforms and opacity. Do not animate full-screen blur, blend modes, or large shadows.
- Keep native browser scrolling authoritative. Springs may smooth animated values, never the scroll position itself.
- Use section-local observers and Motion values; avoid continuous global pointer and scroll listeners.
- Reserve aspect ratios and dimensions for media.
- Lazy-load later chapters and provide separate mobile art direction.
- Apply `will-change` only around active transitions and remove it afterward.
- Pause or unmount decorative animation outside its viewport.
- Test on a real narrow viewport and a throttled device before adding more visual planes.

The budget script measures Vite’s built CSS and JavaScript assets after gzip. Lighthouse CI audits the local production build in GitHub Actions.
