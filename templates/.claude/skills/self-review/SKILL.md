---
name: self-review
description: Agent self-reviews its own diff against TASTE_INVARIANTS.md before presenting to user.
---

# Self-Review Skill

## Purpose
Verify your own code changes against `TASTE_INVARIANTS.md` before presenting them to the user.

## When to Use
- After completing any code implementation
- Before suggesting changes are ready

## Workflow

### Step 1: Gather Your Changes
Identify all files you modified or created.

### Step 2: Run Invariant Checks
For each modified file, check against `TASTE_INVARIANTS.md`:

```bash
# Check for deprecated APIs
rg 'DEPRECATED_PATTERN_1' <file>
rg 'DEPRECATED_PATTERN_2' <file>

# Check for hardcoded strings in UI
rg 'HARDCODED_STRING_PATTERN' <file>

# Check for hardcoded colors
rg 'HARDCODED_COLOR_PATTERN' <file>

# Check for force unwraps
rg 'FORCE_UNWRAP_PATTERN' <file>

# Check for print statements
rg 'print\(' <file>
```

### Step 3: Check Refactoring Completeness
If you renamed anything:
```bash
rg "oldName" <file-pattern>
```
Ensure 0 results outside generated files.

### Step 4: Report
- If violations found: fix them before presenting to user
- If clean: proceed silently
- If uncertain about an exception: note it to the user

## Key Principle
> "When the agent struggles, the fix is never 'try harder' — it's 'what capability is missing?'"

## Related
- `TASTE_INVARIANTS.md` — source of truth for mechanical rules
- `code-review-developer` — for reviewing others' code
