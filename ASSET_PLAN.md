# Asset Plan

Last updated: 2026-08-20

## Asset inventory

- First-viewport atmosphere is CSS-generated from gradients and geometric planes.
- Paper panels, leaves, ridges, river, sun, and workflow ornaments are CSS-native.
- The demo ships no photographic, video, canvas, or generated bitmap assets.

## Loading strategy

- The initial bundle contains the runtime and first-viewport styles.
- Motion features load through `LazyMotion`.
- Future media must reserve dimensions, load only near its chapter, and follow configured budgets.

## Responsive variants

- CSS scenery uses breakpoint-specific crop, scale, and plane reduction.
- Future image assets require explicit desktop and mobile art-direction decisions rather than automatic shrinking alone.

## Licensing and provenance

- Repository-authored CSS scenery is MIT licensed with the project.
- New third-party assets require documented source, license, and adaptation notes before merging.
