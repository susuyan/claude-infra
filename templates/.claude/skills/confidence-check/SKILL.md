---
name: confidence-check
description: Pre-implementation confidence assessment to prevent wrong-direction work.
---

# Confidence Check (Pre-Implementation Gate)

## Purpose
Prevent costly wrong-direction work by assessing implementation readiness before starting.

## When to Apply
- Before implementing new features
- Before significant refactoring
- Before fixing complex bugs
- When requirements seem ambiguous

## The 5-Check Assessment

| Check | Weight | What to Verify |
|-------|--------|----------------|
| **No Duplicates** | 25% | Search codebase for existing functionality |
| **Pattern Compliance** | 25% | Aligns with project architecture patterns |
| **Documentation Verified** | 20% | Checked existing code, services, APIs |
| **Design System Applied** | 15% | Uses project conventions (naming, constants, etc.) |
| **Root Cause Clear** | 15% | Understand actual problem vs symptoms |

## Decision Thresholds

```
Score >= 90%  -->  PROCEED with implementation
Score 70-89%  -->  PAUSE - present alternatives, ask clarifying questions
Score < 70%   -->  STOP - request more context before proceeding
```

## Quick Checklist

```
CONFIDENCE CHECK:
[ ] No duplicates found (25%)
[ ] Follows project patterns (25%)
[ ] Verified existing code/docs (20%)
[ ] Uses project conventions (15%)
[ ] Root cause understood (15%)

Score: ___% --> [PROCEED/PAUSE/STOP]
```

## When to Skip

Skip for trivial changes (typos, simple renames) or direct user instructions with clear requirements.

## ROI

| Scenario | Without Check | With Check |
|----------|--------------|------------|
| Duplicate implementation | 5,000+ tokens wasted | 100 tokens saved it |
| Wrong architecture | 10,000+ tokens rework | 150 tokens caught early |
| Missing context | 8,000+ tokens redoing | 200 tokens asked first |

**Rule of thumb**: If implementation will take >500 tokens, spend 100-200 on confidence check first.
