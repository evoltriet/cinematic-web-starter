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
- Pull-request CI passed the exact `pnpm validate` and Playwright workflow on GitHub.
- Lighthouse scored 100 for performance, accessibility, best practices, and SEO against the production build.

## Manual review

- Workflow chapter reviewed at 1440×900 and 390×844: hierarchy, code readability, protected surfaces, and mobile stacking approved.
- Existing runtime exports remain unchanged; sanitization found no provider credentials or private production material.

## Release decision

Approved to merge after the QA-report-only commit revalidates. Create the final tag only after the merged GitHub Pages deployment is healthy.
