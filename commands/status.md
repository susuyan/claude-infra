---
description: Show installation status of .claude/ configuration. Displays version, file count, skills, hooks, and v2 feature availability.
---

# claude-infra:status

Display the current status of the Claude Code infrastructure.

## Usage

```
/claude-infra:status
```

## Output Example

```
📊 Claude Code Infrastructure Status

  CLI Version:     2.0.0
  Config Version:  2.0.0
  Project:         /Users/susuyan/projects/my-app
  Files:           34
  Skills:          3
  Hooks:           6
  Audit Tool:      ✅ Present (v2)
  Memory System:   ✅ Present (v2)
```

## Indicators

| Indicator | Meaning |
|-----------|---------|
| **v2 (with audit + memory)** | Full v2 infrastructure with all features |
| **v1 (legacy)** | Pre-v2 config, consider upgrading |
| **Not installed** | No `.claude/` found |

## See Also

- `/claude-infra:audit` — Detailed health check
- `/claude-infra:upgrade` — Upgrade to latest
