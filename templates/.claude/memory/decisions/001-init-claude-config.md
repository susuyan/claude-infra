# ADR-001: Initialize Claude Code Configuration

## Status
Accepted

## Context
The project needs structured AI-assisted development infrastructure. Without it:
- Each Claude session starts from scratch
- Code style violations recur
- Dangerous operations aren't guarded
- Knowledge about the project is scattered

## Decision
Adopt the Claude Code progressive disclosure infrastructure with:
1. **3-level documentation**: CLAUDE.md → Skills → Deep guides
2. **Automated hooks**: Skill activation, safety guards, formatting
3. **Taste Invariants**: Mechanical, grep-able rules
4. **Memory system**: Cross-session continuity via ADRs and conventions

## Consequences

### Positive
- Reduced token waste through progressive disclosure
- Automatic skill suggestions based on context
- Safety guards prevent dangerous git operations
- Consistent code quality through invariant checks
- Knowledge persists across sessions

### Negative
- Initial setup time (~30 minutes)
- Maintenance overhead (weekly log review, monthly convention audit)
- Learning curve for new team members

### Neutral
- Requires discipline to keep CLAUDE.md under 300 lines
- Taste Invariants only work if they're actually checked
