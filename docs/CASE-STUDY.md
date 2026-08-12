# Case Study: From Continuous World to Sectional Cinema

This starter grew from an iterative editorial web experience. The project itself remains anonymous; the lessons are broadly reusable.

## What failed

An early direction placed the entire page inside one continuous scenic world. Global scroll progress moved several full-viewport depth planes, mist, foliage, and lighting at once. The idea was visually coherent on a powerful desktop but introduced major scroll lag and made mobile composition difficult to control.

## What recovered performance

The continuous world was replaced with independent scenic chapters. Each section owned a responsive background and a small number of finite foreground planes. Viewport entrances replaced scroll-scrubbed decoration; only one contained panorama retained local scroll progress. Forms became static.

## What improved quality

- Desktop and mobile artwork were composed separately.
- Decorative objects received contact shadows, lighting, and occlusion instead of relying on large travel distances.
- Passing objects moved forward on a fixed timeline and replayed only after complete exit, so scrolling backward never reversed physical motion.
- Important content rendered visibly by default and reduced motion showed the complete settled scene.
- Durable context and assumption ledgers prevented repeated planning from losing verified decisions.

## The transferable principle

Cinematic quality does not come from animating everything together. It comes from strong composition, a small motion vocabulary, carefully bounded depth, and predictable interaction behavior.
