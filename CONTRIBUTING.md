# Contributing

Thanks for improving Cinematic Web Framework.

## Development

```bash
pnpm install
pnpm dev
pnpm validate
pnpm test:browser
```

## Pull requests

- Read `AGENTS.md` and the durable context files before planning or editing.
- Run `pnpm cinematic:check` after config, chapter, or context changes.
- Keep primitives generic and editable; do not introduce product-specific copy or provider bindings.
- Preserve semantic content, keyboard operation, reduced-motion behavior, and native scrolling.
- Add tests for behavior changes and update documentation when a public primitive changes.
- Include source and license information for any external asset or adapted component.
- Run `pnpm validate` and the sanitization gate before committing.

Please use focused commits and describe user impact, validation, and performance implications in the pull request.
