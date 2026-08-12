# Motion Selection Guide

Choose the smallest motion model that communicates the intended change.

| Need | Use | Avoid |
| --- | --- | --- |
| Introduce copy or a card | `Reveal` | Long staged sequences |
| Send leaves, paper, or particles through a chapter | `TriggeredPassage` | Reversing motion when scrolling backward |
| Move through time or a panorama | `HorizontalStoryTrack` | Global page scroll handlers |
| Suggest depth | `DepthScene` + up to two `DepthPlane`s | Permanent full-page 3D stacks |
| Establish ceremony or anticipation | `CeremonialGate` | Content swapping after the gate clears |
| Show writing | `InkRevealText` | GIF text, raster lettering, or inaccessible canvas |
| Collect information | Static content | Decorative motion competing with focus and typing |

## Timing defaults

- Microinteraction: 180ms.
- Control transition: 320ms.
- Section reveal: 600–900ms.
- Ceremonial opening: 900–1600ms.
- Editorial easing: `[0.22, 1, 0.36, 1]`.

Use linear timing for physical travel that must maintain constant apparent speed. Use editorial easing for arrivals and settling. Reduced motion must show the final readable state immediately.
