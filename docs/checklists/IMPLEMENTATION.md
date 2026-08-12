# Implementation Checklist

- [ ] Project context, design context, and assumptions ledger exist and were read.
- [ ] Semantic content and reading order work before motion is enabled.
- [ ] Desktop and mobile compositions are explicitly designed.
- [ ] Every chapter has one motion mode: entrance, passage, local scroll story, or static.
- [ ] Essential information does not depend on hover or animation.
- [ ] Keyboard focus, dialog inertness, Skip, Replay, and direct-entry behavior work.
- [ ] Reduced motion shows complete settled content immediately.
- [ ] Only first-viewport media is eager; dimensions prevent layout shift.
- [ ] Decorative layers are non-interactive and cannot permanently cover controls.
- [ ] Forms remain stable while focused and call adapters outside animation components.
- [ ] Lint, types, tests, build, budgets, and sanitization pass.
