---
description: Upgrade .claude/ configuration to the latest version. Preserves user customizations (CLAUDE.md, skills, memory) while updating skeleton files.
---

# claude-infra:upgrade

Upgrade the Claude Code infrastructure to the latest version.

## Usage

```
/claude-infra:upgrade
```

## How It Works

1. **Detects current version** — Reads `.claude-version`
2. **Creates backup** — Full copy to `.claude-infra/backup/`
3. **Updates skeleton files** — Only infrastructure files (bin/, hooks/_lib/, workflows/)
4. **Preserves user content** — CLAUDE.md, skills/, memory/, decisions/ untouched
5. **Updates version file** — Writes new version
6. **Runs audit** — Validates after upgrade

## Preservation Rules

| Content | Preserved? |
|---------|-----------|
| `CLAUDE.md` | ✅ Yes |
| Custom skills in `skills/` | ✅ Yes |
| `memory/conventions.md` | ✅ Yes |
| `memory/decisions/` | ✅ Yes |
| `bin/claude-audit.py` | ❌ Updated to latest |
| `hooks/_lib/common.sh` | ❌ Updated to latest |
| `.claude-version` | ❌ Updated to latest |

## Rollback

If something breaks:
```bash
rm -rf .claude
cp -r .claude-backup-YYYYMMDD-HHMMSS .claude
```

## See Also

- `/claude-infra:init` — Fresh install
- `/claude-infra:status` — Check current version
