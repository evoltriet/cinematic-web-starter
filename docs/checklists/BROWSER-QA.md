# Browser QA Checklist

Test at `1440×900`, `768×1024`, `390×844`, `360×800`, and a mobile landscape viewport.

- [ ] No horizontal overflow or empty viewport-sized gaps.
- [ ] Native wheel, touch, keyboard, scrollbar, and anchor navigation remain authoritative.
- [ ] Skip, opener, Replay, and focus restoration work.
- [ ] Triggered passages run forward, fully exit, and replay after re-entry.
- [ ] Local scroll stories remain contained and readable during rapid scrolling.
- [ ] Headings, controls, tabs, accordion buttons, and forms are never persistently occluded.
- [ ] Touch targets are at least 44px and safe-area insets are respected.
- [ ] 200% zoom retains content and controls without horizontal scrolling.
- [ ] Reduced motion removes waits, parallax, passing objects, and 3D flips.
- [ ] Slow media or JavaScript failure does not hide essential content.
- [ ] Keyboard order, visible focus, labels, live regions, and errors are correct.
