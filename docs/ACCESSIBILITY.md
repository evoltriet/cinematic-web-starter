# Accessibility Contract

- Start from semantic HTML and a logical reading order; CSS layers must not determine meaning.
- Every pointer interaction must also work by keyboard and touch. Do not rely exclusively on hover.
- Use at least 44×44 CSS pixels for effective targets, including visually small Skip controls.
- Restore focus after modal openers close and prevent background focus while they are active.
- Tabs implement arrow, Home, and End navigation. Accordions expose `aria-expanded` and `aria-controls`.
- Decorative scenes use `aria-hidden` and `pointer-events: none`.
- `prefers-reduced-motion` renders complete content without parallax, 3D flips, passing objects, or long waits.
- Text survives 200% zoom without clipping, horizontal scrolling, or loss of controls.
- Self-hosted fonts require the character sets used by the product; always define durable system fallbacks.
- Validate focus visibility, contrast, form labels, error association, and screen-reader names separately from visual polish.
