# Contributing

Thanks for improving Cinematic Web Starter.

## Development

```bash
pnpm install
pnpm dev
pnpm validate
pnpm test:browser
```

## Pull requests

- Keep primitives generic and editable; do not introduce product-specific copy or provider bindings.
- Preserve semantic content, keyboard operation, reduced-motion behavior, and native scrolling.
- Add tests for behavior changes and update documentation when a public primitive changes.
- Include source and license information for any external asset or adapted component.
- Run the sanitization gate before committing.

Please use focused commits and describe user impact, validation, and performance implications in the pull request.
