---
description: Review local code changes against base branch
allowed-tools: Bash(git branch:*), Bash(git diff:*), Bash(git fetch:*)
---

# Code Review Command

Review local code changes on the current branch against a base branch.

## Git Context (Precomputed)
- **Fetch**: !`git fetch origin {{MAIN_BRANCH}} 2>/dev/null || echo "(fetch failed)"`
- **Current branch**: !`git branch --show-current`

## Usage
```
/codeReview [to branch <base>]
```

## Process

### Step 1: Get Changed Files
```bash
git diff --name-status origin/<base>...HEAD
git diff --stat origin/<base>...HEAD
git diff origin/<base>...HEAD
```

### Step 2: Apply Review Standards
**Apply guidelines from:** `.claude/CODE_REVIEW_GUIDE.md`

### Step 3: Review Focus Areas
- Check against TASTE_INVARIANTS.md
- Verify no hardcoded strings/colors
- Check generated files not manually edited
- Ensure tests and mocks updated if dependencies changed
- Check for unused code after refactoring

### Step 4: Output
Follow summary format from CODE_REVIEW_GUIDE.md.
