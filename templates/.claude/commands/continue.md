---
description: Continue from a previous session or checkpoint
allowed-tools: Read(*), Bash(git status:*), Bash(git log:*)
---

# Continue Command

Continue work from a previous session or checkpoint.

## Usage
```
/continue
```

## Process

### Step 1: Assess Current State
```bash
git status
git log --oneline -5
```

### Step 2: Identify Outstanding Work
- Check for uncommitted changes
- Review recent commit messages for context
- Look for TODO comments or incomplete implementations

### Step 3: Ask User
"I see [current state]. What would you like to continue working on?"

## Notes
- This command is intentionally lightweight
- The goal is to help the user (and Claude) re-establish context
- Often the user will provide the next task directly
