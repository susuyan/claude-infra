---
description: Initialize Claude Code infrastructure (.claude/) in the current project. Auto-detects project type and generates tailored configuration.
---

# claude-infra:init

Initialize production-grade Claude Code infrastructure in the current project directory.

## Usage

```
/claude-infra:init
```

## What It Does

1. **Detects project type** — Examines files to identify iOS, React, Node, Rust, Go, Python, Java, or Ruby
2. **Generates 32 configuration files** — Tailored templates based on project type
3. **Sets permissions** — Makes hooks executable
4. **Updates .gitignore** — Excludes logs, local settings, session files
5. **Runs first audit** — Validates configuration integrity

## Generated Structure

```
.claude/
├── .claude-version              ← Version tracking
├── CLAUDE.md                    ← Project overview (<300 lines)
├── TASTE_INVARIANTS.md          ← Mechanical rules
├── settings.json                ← Permissions + hooks
├── settings.local.json          ← Local overrides
├── bin/                         ← Audit + admin tools
├── memory/                      ← ADRs, conventions, sessions
├── skills/                      ← Smart router skills
├── hooks/                       ← 6 automated hooks
├── commands/                    ← Slash commands
├── agents/                      ← Specialized agents
└── workflows/                   ← CI templates
```

## Safety

- Backs up existing `.claude/` before overwriting
- Preserves user customizations on upgrade
- All changes are git-tracked

## See Also

- `/claude-infra:audit` — Health check
- `/claude-infra:upgrade` — Incremental upgrade
- `/claude-infra:status` — Show installation status
