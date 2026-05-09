# Memory System

Cross-session continuity for Claude Code. This directory stores context that persists across individual Claude sessions.

## Philosophy

Each Claude session starts with a **blank slate** — it only sees:
1. `CLAUDE.md` (Level 1 overview)
2. Auto-activated Skills (Level 2)
3. Files you explicitly reference

**The problem**: Important context gets lost between sessions:
- Architecture decisions and their rationale
- Why certain conventions exist
- What was tried and didn't work
- Partial task progress

**The solution**: Write it down in `memory/`.

## Directory Structure

```
memory/
├── README.md                 # This file
├── conventions.md            # Living document of project conventions
├── decisions/                # Architecture Decision Records (ADRs)
│   ├── 001-init-claude-config.md
│   ├── 002-migrate-to-swift-6.md
│   └── README.md
└── sessions/                 # Session summaries (auto-generated)
    ├── .gitignore            # Ignores all session files
    └── template.md
```

## Conventions (`conventions.md`)

A **living document** that records project-specific conventions that evolve over time.

**When to update**:
- After a team discussion about code style
- When a new pattern becomes standard
- When an old convention is deprecated

**Format**: Chronological log with dates:
```markdown
## 2026-05-09: Adopted AsyncStandardButton pattern
**Decision**: All async button actions should use `AsyncStandardButton` instead of manual `@State isLoading`.
**Rationale**: Reduces boilerplate, handles errors automatically, provides haptic feedback.
**Files affected**: All Views with async actions.
**Migration**: Gradual — update when touching existing code.
```

## Architecture Decision Records (`decisions/`)

One file per significant architectural decision.

**When to create an ADR**:
- Choosing between two frameworks/libraries
- Changing the project structure
- Introducing a new pattern or convention
- Deciding against a popular approach (document WHY)

**Format** (from Michael Nygard's ADR template):
```markdown
# ADR-00X: Title

## Status
Proposed / Accepted / Deprecated / Superseded by ADR-00Y

## Context
What problem are we solving? What forces are at play?

## Decision
What did we decide?

## Consequences
### Positive
- ...

### Negative
- ...

### Neutral
- ...
```

**Naming**: `00N-short-description.md` — sequential numbers, easy to reference.

## Session Summaries (`sessions/`)

Optional: Claude can write a brief summary of each session here for future reference.

**`.gitignore`**: All session files are ignored — they're ephemeral.

```gitignore
*.md
!.gitignore
!template.md
```

**Template** (`sessions/template.md`):
```markdown
# Session: YYYY-MM-DD HH:MM

## Context
What was the user working on?

## Key Decisions
- Decision 1
- Decision 2

## Files Modified
- `path/to/file.swift`

## Outstanding Tasks
- [ ] Task not completed

## Notes for Future Sessions
Any context that would help a future Claude session pick up where this one left off.
```

## How Claude Uses Memory

When starting a new session, Claude should:
1. Check `memory/conventions.md` for the latest conventions
2. Check `memory/decisions/` for relevant ADRs (search by topic)
3. Read `CLAUDE.md` as always

When making a significant decision during a session, Claude should:
1. Ask the user: "Should I record this decision in memory/decisions/?"
2. If yes, create/update the appropriate file

## Best Practices

1. **Keep it concise** — ADRs should be 1-2 pages max
2. **Link related ADRs** — "See ADR-003 for context"
3. **Update status** — Mark ADRs as Deprecated when superseded
4. **Date everything** — Conventions should have dates
5. **Don't duplicate** — Reference files, don't paste code
6. **Review periodically** — Monthly review of conventions.md for stale entries
