# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-05-09

### Added
- **Unified CLI** — `claude-infra` command with `init`, `audit`, `upgrade`, `status`, `doctor`, `remove`
- **npm package** — Publishable to npm registry, installable via `npm install -g`
- **npx support** — `npx claude-infra init` works without installation
- **Project auto-detection** — Automatically detects iOS, React, Node, Rust, Go, Python, Java, Ruby projects
- **Template engine** — Mustache-style variable substitution for project-specific configuration
- **11-check audit** — Comprehensive configuration health validation
- **Cross-session memory** — ADRs, convention logs, session summaries in `memory/`
- **Hook shared library** — `hooks/_lib/common.sh` for reduced boilerplate
- **CI integration** — GitHub Actions PR review workflow template
- **Version tracking** — `.claude-version` file for incremental upgrades
- **Backup on uninstall** — Automatic backup before removing configuration
- **Migration guide** — v1 → v2 upgrade documentation

### Changed
- Restructured from loose scaffold to formal npm package
- Migrated audit tool from Python to Node.js (zero external dependencies)
- CLI rewritten in pure Node.js for maximum portability

## [1.0.0] - 2026-05-09

### Added
- Initial scaffold release
- Progressive disclosure architecture (CLAUDE.md → Skills → Guides)
- 6 automated hooks (skill activation, branch protection, git guards, formatting)
- 3 core skills (code-review, self-review, confidence-check)
- 3 slash commands (/codeReview, /verify, /continue)
- Taste Invariants (mechanical, grep-able rules)
- Permission matrix with dual-layer safety
