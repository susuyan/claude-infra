---
name: claude-infra-init
description: Initialize or upgrade Claude Code infrastructure in any project. Auto-detects project type and generates a complete .claude/ setup with progressive disclosure documentation, hooks, skills, and safety guards.
---

# Claude Infra Init Skill

## Purpose
Scaffold production-grade Claude Code infrastructure (`.claude/` directory) for any project — new or existing.

## When Auto-Activated
- User asks to "set up claude code", "init claude", "add .claude config"
- Keywords: claude infra, scaffold, setup, initialize, bootstrap
- Project has no `.claude/` directory

## 🚨 CRITICAL RULES

1. **Always backup existing `.claude/` before overwriting**
2. **Preserve user customizations** (CLAUDE.md, skills, memory/) on upgrade
3. **Never commit without explicit user request**
4. **Run audit after installation** to verify integrity

## 📋 Quick Workflow

1. **Detect project type** (iOS, React, Node, Rust, Go, Python, Java, Ruby)
2. **Copy templates** tailored to project type
3. **Fill template variables** (project name, formatter, build tool)
4. **Set permissions** (hooks executable)
5. **Create directories** (logs, memory, decisions, sessions)
6. **Update .gitignore** (logs, local settings, sessions)
7. **Run audit** (11 checks)

## 🎯 Project Type Detection

| Files Present | Type | Formatter |
|--------------|------|-----------|
| `Package.swift`, `.xcodeproj` | iOS | swiftformat |
| `package.json` + react | React | prettier |
| `package.json` | Node | prettier |
| `Cargo.toml` | Rust | rustfmt |
| `go.mod` | Go | gofmt |
| `pyproject.toml` | Python | black |
| `pom.xml`, `build.gradle` | Java | google-java-format |
| `Gemfile` | Ruby | rubocop |

## 📚 Complete Documentation
**Full Guide**: `README.md` in the claude-infra repository

---
**Navigation**: This is a smart router. For implementation details, use the `/claude-infra:init` command.
