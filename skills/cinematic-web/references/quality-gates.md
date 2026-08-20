# Quality Gates

## Structure

- Unique chapter IDs and one approved motion mode per chapter.
- Native scrolling; no undocumented global scroll listener or global scene.
- Public component and data interfaces preserved unless explicitly versioned.

## Accessibility

- Semantic order and fallback content are complete.
- Keyboard path, visible focus, 44px targets, 200% text zoom, and WCAG AA contrast.
- Reduced motion removes parallax, long entrances, and passing decoration without hiding content.

## Responsive

- Review desktop, tablet, 390px, 360px, and mobile landscape.
- No horizontal overflow, unsafe-area collision, unreadable crop, or occluded control.
- Mobile has an intentional composition and reduced scene traffic.

## Performance

- Eager-load only first-viewport essentials.
- Reserve media dimensions and lazy-load later chapters.
- Animate transforms and opacity; apply `will-change` only while active.
- Meet configured JavaScript, CSS, hero, mobile-image, and desktop-image budgets.

## Privacy and release

- Context packet reads allowlisted files only.
- No secrets, personal data, private URLs, provider credentials, or unlicensed assets.
- Automated gates pass; human visual review and exceptions are recorded.
