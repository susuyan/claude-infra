# Project Conventions

**Living document** — update as conventions evolve.

Last reviewed: {{DATE}}

---

## How to Add a Convention

```markdown
## YYYY-MM-DD: Brief title
**Decision**: What was decided
**Rationale**: Why
**Scope**: What parts of the codebase does this affect?
**Migration**: How to adopt (immediate / gradual / new-code-only)
```

---

## Conventions

<!-- Add your project's conventions below, newest first -->

## 2026-01-01: Example Convention
**Decision**: Use `const` instead of `let` for values that never change.
**Rationale**: Makes immutability explicit at a glance.
**Scope**: All JavaScript/TypeScript files.
**Migration**: New code only — don't refactor existing.
