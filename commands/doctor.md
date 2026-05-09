---
description: Diagnose and auto-fix issues in .claude/ configuration. Runs all audit checks and automatically repairs fixable problems.
---

# claude-infra:doctor

Diagnose and automatically repair issues in the Claude Code infrastructure.

## Usage

```
/claude-infra:doctor
```

## Auto-Fix Actions

| Issue | Fix |
|-------|-----|
| Missing `.claude-version` | Creates with default `2.0.0` |
| Hook not executable | `chmod +x` on the file |
| Missing `logs/` directory | Creates with `.gitignore` |
| Missing `.gitignore` patterns | Appends required patterns |

## Non-Fixable Issues

These require manual attention:
- Invalid JSON in `settings.json`
- Missing skill directories
- Inconsistent `skill-rules.json`

## Output

Shows both fixable and non-fixable issues, then applies fixes.

## See Also

- `/claude-infra:audit` — Read-only health check
- `/claude-infra:upgrade` — Incremental upgrade
