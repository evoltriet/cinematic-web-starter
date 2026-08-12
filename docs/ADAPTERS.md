# Backend Adapter Boundaries

Animation components should never own transactional state.

## Recommended boundary

```ts
export type SubmissionAdapter<Input, Result> = {
  load?: (key: string, signal: AbortSignal) => Promise<Input>;
  submit: (input: Input, signal: AbortSignal) => Promise<Result>;
};
```

The page owns loading, errors, validation, and saved-state summaries. The form remains static while focused. The adapter may call a serverless function, traditional API, or local mock.

## Persistence

- Keep the database authoritative; spreadsheets and dashboards are reporting mirrors unless explicitly designed otherwise.
- Use additive migrations and preserve stable public identifiers.
- Make import operations dry-run-first and idempotent.

## Email and scheduling

- Keep provider credentials server-side.
- Separate selection, delivery audit, retry, and business-state commit.
- Use deterministic idempotency keys.
- Recheck state before sending and before committing scheduled changes.
- Never make a browser animation responsible for delivery or database outcomes.

## Deployment

Define hosting through an adapter or documented recipe. Do not embed provider IDs, domains, secrets, or production bindings in reusable framework code.
