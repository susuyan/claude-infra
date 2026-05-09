---
description: Run configuration health check on .claude/ infrastructure. Validates 11 aspects including file integrity, JSON validity, hook permissions, and skill consistency.
---

# claude-infra:audit

Run a comprehensive health check on the Claude Code infrastructure.

## Usage

```
/claude-infra:audit
```

## Checks Performed

| # | Check | Severity |
|---|-------|----------|
| 1 | Core files exist | Critical |
| 2 | JSON files valid | Critical |
| 3 | Hooks executable | Critical |
| 4 | Shared library present | Warning |
| 5 | Skill structure valid | Critical |
| 6 | skill-rules ↔ skills/ consistent | Critical |
| 7 | Commands present | Critical |
| 8 | Version file exists | Warning |
| 9 | Logs directory configured | Warning |
| 10 | .gitignore patterns | Warning |
| 11 | MCP configuration | Info |

## Output Format

```
🔍 Claude Code Configuration Audit

📁 Core Files
  ✅ CLAUDE.md
  ✅ TASTE_INVARIANTS.md
  ...

📋 JSON Validation
  ✅ settings.json Valid JSON
  ✅ skill-rules.json Valid JSON

🪝 Hooks
  ✅ hooks/skill-activation-prompt.sh Executable
  ...

==================================================
Summary: 10 passed, 0 failed, 1 warned (11 total)

✅ All critical checks passed!
```

## Auto-Fix

Use `/claude-infra:doctor` to automatically repair fixable issues (missing logs directory, incorrect permissions, missing version file).

## See Also

- `/claude-infra:doctor` — Diagnose + auto-fix
- `/claude-infra:status` — Quick status overview
