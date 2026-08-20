# Agent Development Workflow

The framework is provider-neutral. Codex, Claude Code, Cursor, and similar coding agents should follow the same repository contract rather than maintain divergent prompt files.

## Setup

1. Clone the template and install dependencies.
2. Run `pnpm cinematic:init -- --project "Project Name"` in a clean consumer project, or fill the existing context files in a cloned template.
3. Give the agent repository access and instruct it to obey the root agent file.
4. Generate a compact context packet with `pnpm cinematic:context -- --format markdown` when needed.
5. Run `pnpm cinematic:check` before planning and after structural changes.

| Agent | Recommended setup |
| --- | --- |
| Codex | Keep `AGENTS.md` at the repository root and optionally install `skills/cinematic-web` as a portable skill. |
| Claude Code | Keep the canonical workflow in repository files; reference `AGENTS.md` from local project instructions if desired. |
| Cursor | Add the required reading order to project rules without copying the full workflow. |
| Other agents | Provide the context packet and require the config, context, and quality gates to remain authoritative. |

No provider receives a special design prompt. The canonical phases live in `docs/recipes/`, the project contract lives in `cinematic.config.json`, and durable project truth lives in the root context files.

## Commands for agents

```bash
pnpm cinematic:init -- --project "Project Name" --dry-run
pnpm cinematic:check -- --format json
pnpm cinematic:context -- --format markdown
pnpm validate
```

All commands are non-interactive. The initializer will not replace existing framework-owned files unless `--force` is explicit, and it never overwrites source components or assets. The context command reads only its documented allowlist and never reads credential files.

## Canonical phases

- [Discovery](./recipes/01-DISCOVERY.md)
- [Experience contract](./recipes/02-EXPERIENCE.md)
- [Art direction and assets](./recipes/03-ART-DIRECTION.md)
- [Implementation](./recipes/04-IMPLEMENTATION.md)
- [Quality assurance](./recipes/05-QA.md)
- [Release](./recipes/06-RELEASE.md)
