# Design Context

Last updated: 2026-08-20

## Art direction

An editorial field guide moving from mineral dawn to paper, ink, and dusk. Depth feels crafted through composition, occlusion, and restraint rather than constant movement.

## Design tokens

- Forest, mineral blue, rice paper, clay, moss, and antique gold are defined in `src/styles/tokens.css`.
- Type uses a serif display voice with a clear sans-serif body fallback stack.
- Geometry favors crisp paper panels, circular celestial forms, controlled shadows, and generous spacing.

## Responsive composition

- Desktop uses open scenic fields and paired editorial panels.
- Mobile simplifies depth traffic, stacks informational material, and preserves the same narrative meaning.
- Content never relies on a background image for legibility.

## Motion language

- Microinteractions are quick; chapter entrances use editorial easing; ceremonial moments may be slower.
- Transforms and opacity are the preferred animated properties.
- Finite decoration resets only after a complete viewport exit. One contained local scroll story is permitted.

## Anti-patterns

- No scroll hijacking, global cinematic scene, continuous pointer follower, WebGL spectacle, autoplay media, or hover-only meaning.
- No generic landing-page bento treatment, excessive rounded cards, or animation attached to every element.
- No desktop composition simply scaled down for mobile.
