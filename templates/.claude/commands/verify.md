---
description: Verify implementation against project standards
allowed-tools: Read(*), Grep(*), Bash(git status:*)
---

# Verify Command

Verify code implementation against project standards and invariants.

## Usage
```
/verify
```

## Checks

### Architecture
- [ ] Follows project patterns (MVC/MVVM/etc.)
- [ ] Proper separation of concerns
- [ ] No business logic in views/presentation layer

### Code Quality
- [ ] No deprecated APIs used
- [ ] No hardcoded strings in UI
- [ ] No hardcoded colors/fonts
- [ ] No force unwraps
- [ ] No print() statements

### Refactoring Completeness
- [ ] All references updated if renaming
- [ ] Unused code removed
- [ ] Tests updated if dependencies changed

### Generated Files
- [ ] No generated files manually edited

## Output
Report pass/fail for each check. If any fail, list specific file:line locations.
