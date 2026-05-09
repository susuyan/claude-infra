# 领域 Skill 自动生成设计

> claude-infra 的核心价值：不是给你一套固定模板，而是**搭建一个框架，让 Claude Code 自己根据你的代码库，发现和生成领域 Skill**。

---

## 一、核心问题

### 为什么固定 Skill 不够？

```
固定模板的问题：
├── ios-dev-guidelines/          ← 写死了，不够细
├── swift-concurrency-developer/ ← 写死了，不够细
└── swiftui-patterns-developer/  ← 写死了，不够细

你的项目实际情况：
├── 自定义的 NavigationCoordinator（项目特有）
├── 自研的网络中间件（项目特有）
├── 独特的 FeatureFlag 系统（项目特有）
└── 团队约定的命名规范（团队特有）
```

**固定 Skill = 通用教材，领域 Skill = 项目实战笔记。**

### 什么是领域 Skill？

从代码库中**自动发现**的、**项目特有**的模式：

| 层级 | 类型 | 示例 |
|------|------|------|
| **技术栈** | SwiftUI + Combine | `swiftui-combine-patterns` |
| **架构层** | 自定义 Coordinator | `navigation-coordinator` |
| **业务层** | 自研同步引擎 | `sync-engine-patterns` |
| **工具层** | 内部脚本约定 | `build-script-conventions` |
| **团队层** | 代码审查习惯 | `team-review-conventions` |

---

## 二、设计目标

1. **零配置启动** — `claude-infra init` 后，Claude Code 自动开始扫描
2. **按需发现** — 不预置，而是根据代码库内容动态识别
3. **渐进生成** — 第一次只生成骨架，使用越多越完善
4. **持续演化** — Claude Code 在工作中不断发现新模式，自动更新 Skill

---

## 三、架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                        claude-infra init                         │
└─────────────────────────────────────────────────────────────────┘
    │
    ├── 1. 生成静态骨架（基础）
    │   ├── CLAUDE.md
    │   ├── settings.json
    │   ├── hooks/
    │   ├── 通用 skills/（code-review, self-review, confidence-check）
    │   └── ...
    │
    └── 2. 生成动态探测框架 🔥
        ├── .claude/skills/.generator/
        │   ├── DOMAIN_DETECTION.md      ← 探测规则库
        │   ├── SKILL_TEMPLATE.md        ← Skill 文件模板
        │   └── REGISTRY.md              ← 已生成领域清单
        └── 触发 Claude Code 执行探测
```

---

## 四、探测框架（.generator/）

### 4.1 DOMAIN_DETECTION.md

告诉 Claude Code：**如何扫描代码库、识别领域、生成 Skill**。

```markdown
# 领域探测规则库

## 规则格式

每个领域包含：
- **触发信号** — 代码中出现什么文件/类/模式时激活探测
- **探测指令** — Claude Code 应该扫描什么、问什么问题
- **生成模板** — Skill 文件的结构
- **激活规则** — 注册到 skill-rules.json 的条件

---

## 领域：iOS / SwiftUI UI 层

### 触发信号
```
文件后缀: .swift
导入语句: import SwiftUI
类/结构定义: struct.*: View
```

### 探测指令
扫描代码库后回答：
1. 项目使用哪些自定义 View 组件？命名规范是什么？
2. State 管理使用 @State、@ObservedObject、@Environment 还是自定义？
3. 导航模式是 NavigationStack、自定义 Coordinator、还是 TabView？
4. 是否有项目特有的 ViewModifier？
5. 常见的反模式是什么？（从历史 commit 或 TODO 中发现）

### 生成 Skill
文件: `.claude/skills/GENERATED/ios-ui-patterns/SKILL.md`

### 激活规则
```json
{
  "ios-ui-patterns": {
    "keywords": ["swiftui", "view", "modifier", "navigation"],
    "pathPatterns": ["**/*.swift"],
    "contentPatterns": ["struct.*: View", "import SwiftUI"]
  }
}
```

---

## 领域：网络层

### 触发信号
```
类名模式: .*Service.*, .*Client.*, .*API.*
导入: Alamofire, URLSession, Moya, axios, fetch
```

### 探测指令
1. 网络请求封装在哪一层？
2. 错误处理模式是什么？
3. 重试/缓存/离线策略如何？
4. 认证 Token 刷新逻辑？
5. 是否有项目特有的 Request/Response 转换？

### 生成 Skill
文件: `.claude/skills/GENERATED/networking-patterns/SKILL.md`

---

## 领域：数据持久化

### 触发信号
```
导入: CoreData, Realm, SQLite, GRDB, Prisma, Mongoose
类名: .*Repository.*, .*Store.*, .*DAO.*
```

### 探测指令
1. 使用哪种持久化方案？
2. 数据模型定义在哪里？
3. 迁移策略是什么？
4. 查询/事务模式？
5. 和云端同步的冲突处理？
```

### 4.2 SKILL_TEMPLATE.md

```markdown
---
name: {{DOMAIN_NAME}}
description: {{DOMAIN_DESCRIPTION}} Auto-generated from codebase analysis.
---

# {{DOMAIN_NAME}} (Generated Domain Skill)

## 🎯 Purpose
{{PURPOSE}}

## 🚨 CRITICAL RULES (NEVER Violate)
{{CRITICAL_RULES}}

## 📋 Quick Reference
{{QUICK_REFERENCE}}

## ⚠️ Common Mistakes (Historical)
{{COMMON_MISTAKES}}

## 🔍 Detection Signals
This skill activates when:
- Keywords: {{KEYWORDS}}
- File patterns: {{FILE_PATTERNS}}
- Code patterns: {{CODE_PATTERNS}}

## 📚 Where to Find Deep Docs
{{DEEP_DOCS}}

---
**Auto-generated**: {{GENERATED_AT}}
**Last updated**: {{LAST_UPDATED}}
**Confidence**: {{CONFIDENCE}}/10
```

### 4.3 REGISTRY.md

记录已生成领域，防止重复生成：

```markdown
# Generated Domain Skills Registry

| Domain | Generated | Confidence | Status |
|--------|-----------|------------|--------|
| ios-ui-patterns | 2026-05-09 | 9/10 | active |
| networking-patterns | 2026-05-09 | 8/10 | active |
| navigation-coordinator | 2026-05-09 | 7/10 | draft |
```

---

## 五、CLAUDE.md 中的探测触发器

在 CLAUDE.md 中加入专门的探测触发器，让 Claude Code 知道何时该生成/更新领域 Skill：

```markdown
## 🧠 Domain Skill System

This project uses **auto-generated domain skills**. When you encounter
unfamiliar code patterns or the `confidence-check` indicates missing
context, follow this workflow:

### When to Generate a New Domain Skill

触发条件（任一满足）：
1. `confidence-check` 得分 < 90% 且原因不明
2. 遇到不在现有 Skill 中的代码模式
3. 用户提到一个系统/模块你没有对应 Skill
4. 代码审查时发现重复出现的特定模式

### Generation Workflow

```
发现未知领域
    ↓
读取 .claude/skills/.generator/DOMAIN_DETECTION.md
    ↓
扫描代码库（grep + 文件阅读）
    ↓
提取关键模式、规则、反模式
    ↓
生成 Skill 文件到 .claude/skills/GENERATED/{domain}/
    ↓
注册到 .claude/hooks/skill-rules.json
    ↓
更新 REGISTRY.md
    ↓
运行 claude-infra audit 验证
```

### When to Update an Existing Domain Skill

- 发现了新的反模式（添加到 Common Mistakes）
- 架构发生变化（更新 Critical Rules）
- 用户纠正了你的理解（更新 Quick Reference）

### Skill Quality Standards

生成的 Skill 必须：
- [ ] < 200 行（路由到深度文档，不要放百科全书）
- [ ] 包含至少 3 条 Critical Rules
- [ ] 包含至少 2 个 Common Mistakes
- [ ] 有明确的激活关键词和文件模式
- [ ] 注册到 skill-rules.json
```

---

## 六、实际运行流程

### 场景 1：初始化时首次探测

```
用户: claude-infra init

CLI 输出:
  ✅ 基础骨架已生成
  🧠 下一步：让 Claude Code 扫描代码库，生成领域 Skill
  
  请打开 Claude Code，它会自动读取 .claude/skills/.generator/
  并为你生成项目特有的领域 Skill。

Claude Code 读取:
  1. CLAUDE.md → 看到 Domain Skill System 指示
  2. DOMAIN_DETECTION.md → 了解探测规则
  3. 扫描代码库 → 发现 SwiftUI + Combine + 自定义 NetworkLayer
  
Claude Code 生成:
  .claude/skills/GENERATED/
  ├── ios-ui-patterns/SKILL.md
  ├── swift-combine-patterns/SKILL.md
  └── networking-patterns/SKILL.md
  
Claude Code 注册:
  更新 .claude/hooks/skill-rules.json
  
用户: 完成了，现在有 3 个领域 Skill
```

### 场景 2：工作中发现新领域

```
用户: "帮我改一下这个同步逻辑"

Claude Code:
  1. confidence-check → 发现 "sync" 不在任何已知领域
  2. 读取 DOMAIN_DETECTION.md → 查找 sync 相关规则
  3. 发现 "数据同步" 领域触发器
  4. 扫描代码库中的 sync 相关代码
  5. 生成 .claude/skills/GENERATED/sync-engine-patterns/SKILL.md
  6. 继续处理用户请求（现在有了完整上下文）
  
Claude Code 回复:
  "我发现这个项目有一个自研的同步引擎，我已经为它生成了一个
   领域 Skill。现在我来处理你的同步逻辑修改..."
```

### 场景 3：用户主动要求生成

```
用户: "我们有个内部的 Analytics 系统，你能了解一下吗？"

Claude Code:
  1. 没有现成 Skill
  2. 扫描 Analytics 相关代码
  3. 生成 .claude/skills/GENERATED/analytics-patterns/SKILL.md
  4. 用新 Skill 回答用户问题
```

---

## 七、Skill 演化机制

### 版本追踪

每个生成的 Skill 文件头包含：
```markdown
---
generated_at: 2026-05-09
confidence: 8/10
version: 1
last_updated: 2026-05-09
evolution_count: 0
---
```

### 自动更新触发器

在 `post-tool-use-tracker.sh` 中增加逻辑：
```bash
# 当 Claude 修改了 GENERATED/ 目录下的 skill 相关代码时
# 提示："检测到领域代码变更，是否更新对应 Skill？"
```

### 置信度系统

| 置信度 | 含义 | 操作 |
|--------|------|------|
| 9-10 | 非常确定 | 直接生成，高优先级 |
| 7-8 | 比较确定 | 生成，但标记为 draft |
| 5-6 | 不太确定 | 询问用户确认 |
| <5 | 不确定 | 不生成，记录到观察日志 |

---

## 八、关键设计决策

### 为什么让 Claude Code 生成，而不是 CLI 工具？

| 方式 | 优点 | 缺点 |
|------|------|------|
| **CLI 生成**（静态分析） | 快速、可复现 | 无法理解语义，只能匹配文本 |
| **Claude Code 生成**（AI 分析） | 理解语义、提取模式、生成高质量文档 | 需要 AI 上下文 |

**选择 Claude Code 生成**，因为：
1. 领域 Skill 的核心价值是**语义理解**，不是文本匹配
2. 需要读取代码、理解架构、总结模式——这正是 Claude Code 的强项
3. CLI 工具只负责**搭建框架**，AI 负责**填充内容**

### 为什么用文件而不是数据库存储？

- **可版本控制** — Skill 文件可以 git diff
- **可手动编辑** — 开发者可以直接改 SKILL.md
- **渐进披露** — 符合整个架构的设计理念
- **零依赖** — 不需要数据库服务

### 为什么放在 GENERATED/ 目录？

```
skills/
├── code-review-developer/     ← 静态（手写，项目无关）
├── self-review/               ← 静态（手写，项目无关）
├── confidence-check/          ← 静态（手写，项目无关）
└── GENERATED/                 ← 动态（AI 生成，项目特有）
    ├── ios-ui-patterns/
    ├── networking-patterns/
    └── sync-engine-patterns/
```

**区分意图**：
- 静态 Skill = 通用能力（所有项目一样）
- GENERATED/ = 领域知识（这个项目特有）
- `.gitignore` 可以配置是否提交 GENERATED/（建议提交，因为包含项目知识）

---

## 九、实现优先级

| 优先级 | 功能 | 说明 |
|--------|------|------|
| **P0** | 基础骨架生成 | `claude-infra init` 生成静态模板 + .generator/ 框架 |
| **P0** | DOMAIN_DETECTION.md | 核心探测规则库，包含 10-15 个常见领域 |
| **P1** | CLAUDE.md 触发器 | 在 CLAUDE.md 中加入探测工作流指示 |
| **P1** | Skill 生成模板 | SKILL_TEMPLATE.md 标准化输出格式 |
| **P2** | REGISTRY.md | 追踪已生成领域，防止重复 |
| **P2** | 置信度系统 | 标记生成质量，指导后续优化 |
| **P3** | 自动更新触发 | post-tool-use 检测变更，提示更新 Skill |
| **P3** | 领域探测扩展 | 社区贡献更多探测规则 |

---

## 十、与传统方案对比

| 方案 | 配置方式 | 领域知识 | 维护成本 |
|------|---------|---------|---------|
| **手动写 CLAUDE.md** | 一个巨大文件 | 容易遗漏 | 高（手动更新） |
| **固定 Skill 模板** | 预制 20 个 Skill | 通用但不精准 | 中（复制粘贴） |
| **claude-infra 动态生成** | AI 扫描代码库 | **精准、项目特有** | **低（自动生成）** |

**核心差异**：从"给 AI 一本教科书"变成"让 AI 自己写学习笔记"。

---

*这就是 claude-infra 的核心设计：不是给 Claude Code 更多文档，而是给它一个**框架**，让它自己成为项目的领域专家。*
