---
name: code-review-developer
description: Smart router to code review guidelines. Review standards, actionable feedback only.
---

# Code Review Developer (Smart Router)

## Purpose
Context-aware routing to code review guidelines for conducting thorough, actionable reviews.

## When Auto-Activated
- Reviewing pull requests or code changes
- Keywords: code review, PR review, review code, approve, issues
- Discussing review comments or feedback

## 🚨 CRITICAL RULES

1. **ONLY include sections when there are ACTUAL issues**
2. **NO "Strengths" or praise sections**
3. **NO "no concerns" statements** — skip the section entirely
4. **NO design/UI/spacing suggestions** — you cannot see the visual design
5. **Reference specific file:line locations** for issues
6. **If no issues found**: Comment ONLY `✅ **Approved** - No issues found`

## 📋 Review Sections

Include ONLY if issues exist:

### Bugs/Issues
Logic errors, potential bugs

### Best Practices
Violations of conventions or guidelines

### Performance
Actual performance problems (not theoretical)

### Security
Real security vulnerabilities

## Summary Format

End with ONE sentence:
- ✅ **Approved** - [brief reason]
- ⚠️ **Minor Issues** - [what needs fixing]
- 🚨 **Major Issues** - [critical problems]

## ⚠️ Common Analysis Mistakes

### Mistake: Assuming Unused Code After UI Removal
**Wrong**: "Parameter is unused, should be removed"
**Correct**: Trace ALL usages before declaring unused. Check for dual-access patterns (button + context menu).

### Mistake: Flagging Properly Regenerated Files
**Wrong**: "Edited generated file instead of running code generation"
**Correct**: Check if corresponding SOURCE file is also in the PR diff. If yes → regeneration was proper.

## 📚 Complete Documentation
**Full Guide**: `.claude/CODE_REVIEW_GUIDE.md`

---
**Navigation**: This is a smart router. For details, refer to CODE_REVIEW_GUIDE.md.
