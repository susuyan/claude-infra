# claude-infra

> Production-grade scaffolding and ops toolkit for [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview).
> Initialize, audit, upgrade, and manage your `.claude/` infrastructure with one command.

[![npm version](https://img.shields.io/npm/v/claude-infra.svg)](https://www.npmjs.com/package/claude-infra)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ What is claude-infra?

`claude-infra` scaffolds a complete, production-ready **Claude Code infrastructure** for any project — in seconds.

Instead of manually creating `CLAUDE.md`, hooks, skills, and settings, run one command and get:

- 📄 **Progressive disclosure docs** — `CLAUDE.md` → Skills → Deep guides
- 🪝 **6 automated hooks** — Skill activation, branch protection, git safety guards, auto-formatting
- 🧠 **3 core skills** — Code review, self-review, pre-implementation confidence check
- 🔒 **Permission matrix + dual-layer safety** — `settings.json` deny list + hook regex guards
- 🔍 **Built-in audit** — 11 automated health checks
- 🧠 **Cross-session memory** — ADRs, convention logs, session summaries
- 🔗 **CI integration** — GitHub Actions PR review template

### 30-Second Demo

```bash
# Install (once)
npm install -g claude-infra

# Initialize in any project
cd ~/projects/my-app
claude-infra init

# Done! Your .claude/ is ready.
```

---

## 📦 Installation

### Via npm (recommended)

```bash
npm install -g claude-infra
```

### Via npx (no install)

```bash
npx claude-infra init
```

### Via Homebrew (coming soon)

```bash
brew install claude-infra
```

### Via curl

```bash
curl -fsSL https://raw.githubusercontent.com/your-org/claude-infra/main/install.sh | bash
```

---

## 🚀 Quick Start

### 1. Initialize

```bash
claude-infra init
```

This will:
1. **Auto-detect your project type** (iOS, React, Node, Rust, Go, Python, Java, Ruby, or generic)
2. **Generate 32 configuration files** tailored to your stack
3. **Set permissions** (hooks executable, scripts runnable)
4. **Update `.gitignore`** (logs, local settings, session files)
5. **Run first audit** (verify everything is healthy)

### 2. Customize

Edit the generated files for your project:

```bash
# Project overview (<300 lines)
vim .claude/CLAUDE.md

# Mechanical rules (grep-able, with fixes)
vim .claude/TASTE_INVARIANTS.md

# Review standards
vim .claude/CODE_REVIEW_GUIDE.md
```

### 3. Verify

```bash
claude-infra doctor
```

Runs 11 health checks and auto-fixes issues.

---

## 📋 Commands

| Command | Description |
|---------|-------------|
| `claude-infra init [DIR]` | Initialize `.claude/` in a project |
| `claude-infra audit [DIR]` | Run configuration health check |
| `claude-infra doctor [DIR]` | Diagnose + auto-fix issues |
| `claude-infra upgrade [DIR]` | Upgrade to latest version |
| `claude-infra status [DIR]` | Show installation status |
| `claude-infra remove [DIR]` | Remove `.claude/` (with backup) |
| `claude-infra --version` | Show version |

### Examples

```bash
# Initialize in current directory
claude-infra init

# Initialize in specific project
claude-infra init ~/projects/my-ios-app

# Check health
claude-infra doctor

# See what's installed
claude-infra status

# Upgrade existing config
claude-infra upgrade

# Remove (creates backup first)
claude-infra remove
```

---

## 🏗️ What Gets Generated

```
.claude/
├── .claude-version                 ← Version tracking
├── CLAUDE.md                       ← Project overview (<300 lines)
├── TASTE_INVARIANTS.md             ← Mechanical, grep-able rules
├── settings.json                   ← Permissions + hooks config
├── settings.local.json             ← Local overrides (gitignored)
├── CODE_REVIEW_GUIDE.md            ← Review standards
├── SKILLS_MANAGEMENT_GUIDE.md      ← How to manage skills/hooks
│
├── bin/                            ← Admin tools
│   ├── claude-audit.py             ← 11-check health auditor
│   └── claude-admin.py             ← Unified management CLI
│
├── memory/                         ← Cross-session continuity
│   ├── conventions.md              ← Living convention log
│   ├── decisions/                  ← Architecture Decision Records
│   │   └── 001-init-claude-config.md
│   └── sessions/                   ← Session summaries (gitignored)
│       ├── .gitignore
│       └── template.md
│
├── skills/                         ← Smart router skills
│   ├── code-review-developer/
│   ├── self-review/
│   └── confidence-check/
│
├── hooks/                          ← Event-driven automation
│   ├── _lib/common.sh              ← Shared utilities
│   ├── skill-activation-prompt.sh  ← Auto-suggests skills
│   ├── post-tool-use-tracker.sh    ← Logs file modifications
│   ├── branch-protection-pre-edit.sh ← Warns on protected branches
│   ├── dangerous-git-guard.sh      ← Blocks destructive git ops
│   ├── bash-safety-guard.sh        ← Blocks unsafe bash patterns
│   ├── {formatter}-post-edit.sh    ← Auto-formats on save
│   └── skill-rules.json            ← Activation rules
│
├── commands/                       ← Slash commands
│   ├── codeReview.md
│   ├── verify.md
│   └── continue.md
│
├── agents/                         ← Specialized agents
│   └── build-checker.md
│
└── workflows/                      ← CI templates
    └── claude-code-review.yml      ← GitHub Actions PR review
```

---

## 🔍 Architecture

### Progressive Disclosure

```
Level 1: CLAUDE.md (<300 lines)          ← Loaded every session
    ↓ triggers
Level 2: Skills (~100-200 lines)           ← Auto-activated by context
    ↓ routes to
Level 3: Deep guides (300-500 lines)       ← Referenced on demand
```

**Token efficiency**: ~1,600 tokens for full path vs 5,000+ for single encyclopedia file.

### Dual-Layer Safety

| Layer | Mechanism | What it blocks |
|-------|-----------|----------------|
| **settings.json deny** | Prefix matching | `git reset`, `git push --force` |
| **dangerous-git-guard.sh** | Regex deep matching | `git push origin main --force` |

### Mechanical Rules > Willpower

All [TASTE_INVARIANTS.md](templates/.claude/TASTE_INVARIANTS.md) rules are:
- ✅ `grep`-able (have a regex pattern)
- ✅ Have clear remediation
- ✅ Document exceptions

---

## 🔧 Supported Project Types

| Type | Detection | Formatter | Build |
|------|-----------|-----------|-------|
| **iOS / macOS** | `Package.swift`, `.xcodeproj` | `swiftformat` | `xcodebuild` |
| **React / Web** | `package.json` + react | `prettier` | `npm` |
| **Node.js** | `package.json` | `prettier` | `npm` |
| **Rust** | `Cargo.toml` | `rustfmt` | `cargo` |
| **Go** | `go.mod` | `gofmt` | `go` |
| **Python** | `pyproject.toml`, `requirements.txt` | `black` | `pytest` |
| **Java / Kotlin** | `pom.xml`, `build.gradle` | `google-java-format` | `gradle` |
| **Ruby** | `Gemfile` | `rubocop` | `bundle` |
| **Generic** | Fallback | — | — |

---

## 🔄 Upgrade

```bash
# Check for and apply upgrade
claude-infra upgrade

# Auto-confirm
claude-infra upgrade --yes
```

Upgrades are **incremental** — your customizations (CLAUDE.md, skills, memory/) are preserved.

---

## 📊 Maintenance

| Frequency | Task | Command |
|-----------|------|---------|
| **Weekly** | Health check | `claude-infra doctor` |
| **Weekly** | Check activation logs | `tail .claude/logs/skill-activations.log` |
| **Monthly** | Update conventions | Edit `.claude/memory/conventions.md` |
| **Monthly** | Review ADRs | Check `.claude/memory/decisions/` |
| **Quarterly** | Check for upgrades | `claude-infra upgrade` |

---

## 🛠️ Development

```bash
# Clone
git clone https://github.com/your-org/claude-infra.git
cd claude-infra

# Link for local testing
npm link

# Test in a project
cd ~/projects/my-app
claude-infra init

# Unlink when done
npm unlink -g claude-infra
```

---

## 📚 Philosophy

This project is built on three principles learned from the [Anytype iOS](https://github.com/anyproto/anytype-swift) team's Claude Code infrastructure:

1. **Progressive Disclosure** — Load only what's needed, when it's needed
2. **Mechanical Rules > Willpower** — Every rule should be `grep`-able with a clear fix
3. **Zero-Friction Automation** — Skills auto-activate, hooks auto-run, formatters auto-trigger

---

## 📄 License

MIT © [Craft Agent](https://craft.do)

---

## 🙏 Acknowledgments

- [Anytype iOS](https://github.com/anyproto/anytype-swift) — Original progressive disclosure architecture
- [Harness Engineering: Codex](https://openai.com/index/harness-engineering/) — "Golden principles" pattern
- [diet103/claude-code-infrastructure-showcase](https://github.com/diet103/claude-code-infrastructure-showcase) — Hooks system inspiration
- [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — ADR format
