# Skills System

Smart routing system using **progressive disclosure** architecture.

## 3-Level Information Architecture

```
Level 1: CLAUDE.md
├─ Quick start + critical rules
├─ Links to Level 2 (Skills) and Level 3 (Guides)
└─ Always loaded, lightweight

Level 2: Skills (this directory)
├─ Critical rules worth duplicating
├─ Quick reference patterns
├─ Decision trees and checklists
└─ "→ Routes to" pointers to Level 3

Level 3: Specialized Guides
├─ Comprehensive documentation
├─ Single source of truth
└─ Referenced when deep knowledge needed
```

## Available Skills

| Skill | Type | Priority | Purpose |
|-------|------|----------|---------|
| `code-review-developer` | Smart Router | high | Code review guidelines |
| `self-review` | Workflow | medium | Pre-submit invariant checks |
| `confidence-check` | Workflow Gate | high | Pre-implementation assessment |

## Smart Router Template

```markdown
---
name: skill-name
description: Context-aware routing to [topic]
---

# Skill Name

## Purpose
What this skill helps with.

## When Auto-Activated
- File types: ...
- Keywords: ...

## 🚨 CRITICAL RULES
1. Must-follow rule

## 📋 Quick Reference
[Tables, examples only]

## 📚 Complete Documentation
**Full Guide**: `path/to/GUIDE.md`

---
**Navigation**: This is a smart router. For details, refer to GUIDE.md.
```

**Key principles**:
- ~100-200 lines
- Critical rules duplicated for visibility
- Quick reference only
- Clear "→ Routes to" pointers
- No resource files
