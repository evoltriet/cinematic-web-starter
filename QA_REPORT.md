# QA Report

Last updated: 2026-08-20

## Release target

Version 0.2.0 of Cinematic Web Framework.

## Automated gates

- Configuration, durable context, and structural checks: passed locally.
- Lint, type check, five runtime unit tests, and eleven tooling tests: passed locally.
- Production build, sanitization, and budgets: passed locally at 95.7 KB JavaScript and 4.8 KB CSS gzip, with no raster demo assets.
- Playwright: eight checks passed across desktop, tablet, 390px, 360px, mobile landscape, keyboard, and reduced motion.
- Portable skill: passed the official skill validator.
- Lighthouse and hosted Pages verification: required in CI before the release decision is finalized.

## Manual review

- Workflow chapter reviewed at 1440×900 and 390×844: hierarchy, code readability, protected surfaces, and mobile stacking approved.
- Existing runtime exports remain unchanged; sanitization found no provider credentials or private production material.

## Release decision

Hold the final tag until pull-request CI, Lighthouse, and Pages deployment pass on the validated merge commit.
