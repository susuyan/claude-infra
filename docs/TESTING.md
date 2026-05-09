# claude-infra 测试策略

> 分层测试方案：单元 → 集成 → E2E，覆盖模板、CLI、审计、生命周期全链路。

---

## 测试分层架构

```
┌─────────────────────────────────────────────────────────────┐
│  E2E Tests (tests/e2e/)                                     │
│  完整生命周期：install → audit → upgrade → remove          │
│  运行时间：~10s per case                                    │
├─────────────────────────────────────────────────────────────┤
│  Integration Tests (tests/integration/)                     │
│  文件系统 + 模板渲染 + 权限 + gitignore                     │
│  运行时间：~2s per case                                     │
├─────────────────────────────────────────────────────────────┤
│  Unit Tests (tests/unit/)                                   │
│  纯函数：检测逻辑、审计规则、版本比较                       │
│  运行时间：~50ms per case                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. 单元测试（Unit）

### 1.1 项目类型检测

```javascript
// tests/unit/project-detector.test.js
const { detectProjectType } = require('../../lib/project-detector');
const assert = require('assert');

describe('detectProjectType', () => {
  const tmpDir = '/tmp/claude-infra-test-project';

  beforeEach(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('detects iOS project by Package.swift', () => {
    fs.writeFileSync(path.join(tmpDir, 'Package.swift'), '');
    assert.strictEqual(detectProjectType(tmpDir), 'ios');
  });

  it('detects React project by package.json with react dep', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ dependencies: { react: '^18.0.0' } })
    );
    assert.strictEqual(detectProjectType(tmpDir), 'react');
  });

  it('detects Node project by package.json without react', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'my-server' })
    );
    assert.strictEqual(detectProjectType(tmpDir), 'node');
  });

  it('detects Rust project by Cargo.toml', () => {
    fs.writeFileSync(path.join(tmpDir, 'Cargo.toml'), '[package]\nname = "test"');
    assert.strictEqual(detectProjectType(tmpDir), 'rust');
  });

  it('detects Go project by go.mod', () => {
    fs.writeFileSync(path.join(tmpDir, 'go.mod'), 'module example.com/test');
    assert.strictEqual(detectProjectType(tmpDir), 'go');
  });

  it('detects Python project by pyproject.toml', () => {
    fs.writeFileSync(path.join(tmpDir, 'pyproject.toml'), '[project]');
    assert.strictEqual(detectProjectType(tmpDir), 'python');
  });

  it('detects Java project by pom.xml', () => {
    fs.writeFileSync(path.join(tmpDir, 'pom.xml'), '<project></project>');
    assert.strictEqual(detectProjectType(tmpDir), 'java');
  });

  it('detects Ruby project by Gemfile', () => {
    fs.writeFileSync(path.join(tmpDir, 'Gemfile'), 'source "https://rubygems.org"');
    assert.strictEqual(detectProjectType(tmpDir), 'ruby');
  });

  it('falls back to generic for unknown projects', () => {
    assert.strictEqual(detectProjectType(tmpDir), 'generic');
  });

  it('prioritizes iOS over Node when both files exist', () => {
    fs.writeFileSync(path.join(tmpDir, 'Package.swift'), '');
    fs.writeFileSync(path.join(tmpDir, 'package.json'), '{}');
    assert.strictEqual(detectProjectType(tmpDir), 'ios');
  });
});
```

### 1.2 模板渲染

```javascript
// tests/unit/template.test.js
const { renderTemplate } = require('../../lib/template');
const assert = require('assert');

describe('renderTemplate', () => {
  it('replaces simple variables', () => {
    const result = renderTemplate('Hello {{NAME}}!', { NAME: 'World' });
    assert.strictEqual(result, 'Hello World!');
  });

  it('replaces multiple variables', () => {
    const template = '{{GREETING}} {{NAME}}, welcome to {{PROJECT}}!';
    const result = renderTemplate(template, {
      GREETING: 'Hi',
      NAME: 'Alice',
      PROJECT: 'MyApp'
    });
    assert.strictEqual(result, 'Hi Alice, welcome to MyApp!');
  });

  it('removes mustache blocks for missing optional vars', () => {
    const template = 'Base{{#OPTIONAL}} optional{{/OPTIONAL}}';
    const result = renderTemplate(template, {});
    assert.strictEqual(result, 'Base');
  });

  it('keeps mustache blocks when vars present', () => {
    const template = 'Base{{#OPTIONAL}} {{VALUE}}{{/OPTIONAL}}';
    const result = renderTemplate(template, { VALUE: 'extra' });
    assert.strictEqual(result, 'Base extra');
  });

  it('handles empty string values', () => {
    const result = renderTemplate('Value: {{EMPTY}}', { EMPTY: '' });
    assert.strictEqual(result, 'Value: ');
  });

  it('handles undefined values as empty string', () => {
    const result = renderTemplate('Value: {{MISSING}}', {});
    assert.strictEqual(result, 'Value: ');
  });
});
```

### 1.3 审计规则

```javascript
// tests/unit/audit-rules.test.js
const { isValidJson, hasSkillFrontmatter } = require('../../lib/audit');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Audit Rules', () => {
  describe('isValidJson', () => {
    it('returns true for valid JSON', () => {
      assert.strictEqual(isValidJson('{"key": "value"}'), true);
    });

    it('returns true for empty object', () => {
      assert.strictEqual(isValidJson('{}'), true);
    });

    it('returns false for invalid JSON', () => {
      assert.strictEqual(isValidJson('{invalid}'), false);
    });

    it('returns false for empty string', () => {
      assert.strictEqual(isValidJson(''), false);
    });
  });

  describe('hasSkillFrontmatter', () => {
    const tmpDir = '/tmp/claude-infra-test-skill';

    beforeEach(() => fs.mkdirSync(tmpDir, { recursive: true }));
    afterEach(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    it('returns true for valid SKILL.md with frontmatter', () => {
      fs.writeFileSync(path.join(tmpDir, 'SKILL.md'), `---\nname: test-skill\ndescription: Test skill\n---\n\n# Test\n`);
      assert.strictEqual(hasSkillFrontmatter(tmpDir), true);
    });

    it('returns false for missing SKILL.md', () => {
      assert.strictEqual(hasSkillFrontmatter(tmpDir), false);
    });

    it('returns false for SKILL.md without frontmatter', () => {
      fs.writeFileSync(path.join(tmpDir, 'SKILL.md'), '# Just a markdown file\n');
      assert.strictEqual(hasSkillFrontmatter(tmpDir), false);
    });

    it('returns false for SKILL.md without name field', () => {
      fs.writeFileSync(path.join(tmpDir, 'SKILL.md'), `---\ndescription: Missing name\n---\n`);
      assert.strictEqual(hasSkillFrontmatter(tmpDir), false);
    });
  });
});
```

---

## 2. 集成测试（Integration）

### 2.1 模板文件系统操作

```javascript
// tests/integration/template-fs.test.js
const { copyTemplate } = require('../../lib/template');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Template File System Operations', () => {
  const srcDir = '/tmp/claude-infra-test-src';
  const dstDir = '/tmp/claude-infra-test-dst';

  beforeEach(() => {
    fs.mkdirSync(srcDir, { recursive: true });
    fs.mkdirSync(dstDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(srcDir, { recursive: true, force: true });
    fs.rmSync(dstDir, { recursive: true, force: true });
  });

  it('copies directory tree preserving structure', () => {
    fs.mkdirSync(path.join(srcDir, 'hooks'));
    fs.writeFileSync(path.join(srcDir, 'hooks', 'test.sh'), '#!/bin/bash\n');
    fs.writeFileSync(path.join(srcDir, 'CLAUDE.md'), '# {{PROJECT}}\n');

    copyTemplate(srcDir, dstDir, { PROJECT: 'MyApp' });

    assert.ok(fs.existsSync(path.join(dstDir, 'hooks', 'test.sh')));
    assert.ok(fs.existsSync(path.join(dstDir, 'CLAUDE.md')));
    assert.strictEqual(
      fs.readFileSync(path.join(dstDir, 'CLAUDE.md'), 'utf8'),
      '# MyApp\n'
    );
  });

  it('strips .template suffix from rendered files', () => {
    fs.writeFileSync(path.join(srcDir, 'settings.json.template'), '{"name": "{{PROJECT}}"}');

    copyTemplate(srcDir, dstDir, { PROJECT: 'Test' });

    assert.ok(fs.existsSync(path.join(dstDir, 'settings.json')));
    assert.ok(!fs.existsSync(path.join(dstDir, 'settings.json.template')));
    const content = fs.readFileSync(path.join(dstDir, 'settings.json'), 'utf8');
    assert.ok(content.includes('"Test"'));
  });

  it('creates nested directories', () => {
    fs.mkdirSync(path.join(srcDir, 'skills', 'test-skill'), { recursive: true });
    fs.writeFileSync(path.join(srcDir, 'skills', 'test-skill', 'SKILL.md'), '---\nname: test\n---\n');

    copyTemplate(srcDir, dstDir, {});

    assert.ok(fs.existsSync(path.join(dstDir, 'skills', 'test-skill', 'SKILL.md')));
  });
});
```

### 2.2 权限设置

```javascript
// tests/integration/permissions.test.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Permission Setup', () => {
  const testDir = '/tmp/claude-infra-test-perms';

  beforeEach(() => fs.mkdirSync(testDir, { recursive: true }));
  afterEach(() => fs.rmSync(testDir, { recursive: true, force: true }));

  it('makes .sh files executable', () => {
    fs.writeFileSync(path.join(testDir, 'test.sh'), '#!/bin/bash\n');
    fs.chmodSync(path.join(testDir, 'test.sh'), 0o644);

    // Simulate install script behavior
    fs.chmodSync(path.join(testDir, 'test.sh'), 0o755);

    const stats = fs.statSync(path.join(testDir, 'test.sh'));
    assert.ok(stats.mode & 0o111, 'File should be executable');
  });

  it('preserves non-.sh file permissions', () => {
    fs.writeFileSync(path.join(testDir, 'config.json'), '{}');
    fs.chmodSync(path.join(testDir, 'config.json'), 0o644);

    const stats = fs.statSync(path.join(testDir, 'config.json'));
    assert.strictEqual(stats.mode & 0o777, 0o644);
  });
});
```

### 2.3 .gitignore 更新

```javascript
// tests/integration/gitignore.test.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('.gitignore Management', () => {
  const testDir = '/tmp/claude-infra-test-git';
  const gitignore = path.join(testDir, '.gitignore');

  beforeEach(() => fs.mkdirSync(testDir, { recursive: true }));
  afterEach(() => fs.rmSync(testDir, { recursive: true, force: true }));

  function updateGitignore(dir, patterns) {
    const gi = path.join(dir, '.gitignore');
    let content = fs.existsSync(gi) ? fs.readFileSync(gi, 'utf8') : '';
    for (const p of patterns) {
      if (!content.includes(p)) {
        content += (content.endsWith('\n') ? '' : '\n') + p + '\n';
      }
    }
    fs.writeFileSync(gi, content);
  }

  it('creates .gitignore if not exists', () => {
    updateGitignore(testDir, ['.claude/logs/*.log']);
    assert.ok(fs.existsSync(gitignore));
    const content = fs.readFileSync(gitignore, 'utf8');
    assert.ok(content.includes('.claude/logs/*.log'));
  });

  it('appends to existing .gitignore', () => {
    fs.writeFileSync(gitignore, 'node_modules/\n');
    updateGitignore(testDir, ['.claude/logs/*.log']);
    const content = fs.readFileSync(gitignore, 'utf8');
    assert.ok(content.includes('node_modules/'));
    assert.ok(content.includes('.claude/logs/*.log'));
  });

  it('does not duplicate existing patterns', () => {
    fs.writeFileSync(gitignore, '.claude/logs/*.log\n');
    updateGitignore(testDir, ['.claude/logs/*.log']);
    const content = fs.readFileSync(gitignore, 'utf8');
    const matches = content.match(/\.claude\/logs\/\*\.log/g);
    assert.strictEqual(matches.length, 1, 'Pattern should not be duplicated');
  });

  it('adds all required patterns', () => {
    const required = ['.claude/logs/*.log', '.claude/settings.local.json', '.claude/memory/sessions/*.md'];
    updateGitignore(testDir, required);
    const content = fs.readFileSync(gitignore, 'utf8');
    for (const p of required) {
      assert.ok(content.includes(p), `Should include ${p}`);
    }
  });
});
```

---

## 3. E2E 测试（End-to-End）

### 3.1 完整生命周期

```javascript
// tests/e2e/lifecycle.test.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const CLI = path.resolve(__dirname, '../../bin/claude-infra');

describe('Full Lifecycle', () => {
  const testProject = '/tmp/claude-infra-e2e-project';

  beforeEach(() => {
    fs.rmSync(testProject, { recursive: true, force: true });
    fs.mkdirSync(testProject, { recursive: true });
    fs.writeFileSync(
      path.join(testProject, 'package.json'),
      JSON.stringify({ name: 'e2e-test-app', dependencies: { react: '^18' } })
    );
  });

  afterEach(() => {
    fs.rmSync(testProject, { recursive: true, force: true });
  });

  describe('init', () => {
    it('creates complete .claude/ structure', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });

      const claudeDir = path.join(testProject, '.claude');
      assert.ok(fs.existsSync(claudeDir), '.claude/ should exist');
      assert.ok(fs.existsSync(path.join(claudeDir, 'CLAUDE.md')), 'CLAUDE.md should exist');
      assert.ok(fs.existsSync(path.join(claudeDir, 'settings.json')), 'settings.json should exist');
      assert.ok(fs.existsSync(path.join(claudeDir, 'TASTE_INVARIANTS.md')), 'TASTE_INVARIANTS.md should exist');
      assert.ok(fs.existsSync(path.join(claudeDir, '.claude-version')), '.claude-version should exist');
      assert.ok(fs.existsSync(path.join(claudeDir, 'bin', 'claude-audit.py')), 'audit tool should exist');
      assert.ok(fs.existsSync(path.join(claudeDir, 'memory', 'conventions.md')), 'conventions should exist');
      assert.ok(fs.existsSync(path.join(claudeDir, 'skills', 'code-review-developer', 'SKILL.md')), 'skills should exist');
      assert.ok(fs.existsSync(path.join(claudeDir, 'hooks', 'skill-activation-prompt.sh')), 'hooks should exist');
    });

    it('detects React project correctly', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });

      const claudeDir = path.join(testProject, '.claude');
      const settings = JSON.parse(fs.readFileSync(path.join(claudeDir, 'settings.json'), 'utf8'));

      // Check that React-specific permissions are present
      const allows = settings.permissions.allow;
      assert.ok(allows.some(a => a.includes('npm')), 'Should have npm permissions');
    });

    it('sets correct permissions on hooks', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });

      const hooksDir = path.join(testProject, '.claude', 'hooks');
      for (const hook of fs.readdirSync(hooksDir)) {
        if (hook.endsWith('.sh')) {
          const stats = fs.statSync(path.join(hooksDir, hook));
          assert.ok(stats.mode & 0o111, `${hook} should be executable`);
        }
      }
    });

    it('creates logs directory with .gitignore', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });

      const logsDir = path.join(testProject, '.claude', 'logs');
      assert.ok(fs.existsSync(logsDir), 'logs/ should exist');
      assert.ok(fs.existsSync(path.join(logsDir, '.gitignore')), 'logs/.gitignore should exist');

      const giContent = fs.readFileSync(path.join(logsDir, '.gitignore'), 'utf8');
      assert.ok(giContent.includes('*.log'), 'Should ignore *.log');
    });

    it('updates project .gitignore', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });

      const giContent = fs.readFileSync(path.join(testProject, '.gitignore'), 'utf8');
      assert.ok(giContent.includes('.claude/logs/*.log'), 'Should include logs pattern');
      assert.ok(giContent.includes('.claude/settings.local.json'), 'Should include local settings');
    });
  });

  describe('audit', () => {
    it('passes after successful init', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });

      const result = execSync(`node ${CLI} audit ${testProject}`, { encoding: 'utf8' });
      assert.ok(result.includes('All critical checks passed'), 'Audit should pass');
    });

    it('fails on missing file', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });
      fs.unlinkSync(path.join(testProject, '.claude', 'CLAUDE.md'));

      const result = execSync(`node ${CLI} audit ${testProject}`, { encoding: 'utf8' });
      assert.ok(result.includes('failed'), 'Audit should report failure');
    });
  });

  describe('doctor', () => {
    it('auto-fixes missing logs directory', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });
      fs.rmSync(path.join(testProject, '.claude', 'logs'), { recursive: true });

      execSync(`node ${CLI} doctor ${testProject}`, { stdio: 'pipe' });

      assert.ok(fs.existsSync(path.join(testProject, '.claude', 'logs')), 'logs/ should be recreated');
    });
  });

  describe('remove', () => {
    it('removes .claude/ and creates backup', () => {
      execSync(`node ${CLI} init ${testProject}`, { stdio: 'pipe' });
      const beforeFiles = fs.readdirSync(testProject);

      execSync(`node ${CLI} remove ${testProject} --yes`, { stdio: 'pipe' });

      assert.ok(!fs.existsSync(path.join(testProject, '.claude')), '.claude/ should be removed');

      const afterFiles = fs.readdirSync(testProject);
      const backupDir = afterFiles.find(f => f.startsWith('.claude-backup-'));
      assert.ok(backupDir, 'Backup directory should exist');
    });
  });
});
```

---

## 4. 模板验证测试

```javascript
// tests/integration/template-validation.test.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Template Validation', () => {
  const templatesDir = path.resolve(__dirname, '../../templates/.claude');

  it('all JSON templates are valid JSON', () => {
    const jsonFiles = [
      'settings.json.template',
      'hooks/skill-rules.json.template',
      'settings.local.json',
    ];

    for (const f of jsonFiles) {
      const p = path.join(templatesDir, f);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        // Strip mustache variables for validation
        const cleaned = content.replace(/\{\{[^}]+\}\}/g, '"placeholder"');
        assert.doesNotThrow(() => JSON.parse(cleaned), `${f} should be valid JSON (with placeholders)`);
      }
    }
  });

  it('all .sh files have shebang', () => {
    const hooksDir = path.join(templatesDir, 'hooks');
    for (const f of fs.readdirSync(hooksDir)) {
      if (f.endsWith('.sh') || f.endsWith('.sh.template')) {
        const content = fs.readFileSync(path.join(hooksDir, f), 'utf8');
        assert.ok(content.startsWith('#!/bin/bash') || content.startsWith('#!/usr/bin/env bash'),
          `${f} should have shebang`);
      }
    }
  });

  it('all SKILL.md files have valid frontmatter', () => {
    const skillsDir = path.join(templatesDir, 'skills');
    for (const dir of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (dir.isDirectory() && dir.name !== 'README.md') {
        const skillMd = path.join(skillsDir, dir.name, 'SKILL.md');
        if (fs.existsSync(skillMd)) {
          const content = fs.readFileSync(skillMd, 'utf8');
          assert.ok(content.startsWith('---'), `${dir.name}/SKILL.md should have frontmatter`);
          assert.ok(content.includes('name:'), `${dir.name}/SKILL.md should have name field`);
          assert.ok(content.includes('description:'), `${dir.name}/SKILL.md should have description field`);
        }
      }
    }
  });

  it('CLAUDE.md.template has required sections', () => {
    const claudeMd = path.join(templatesDir, 'CLAUDE.md.template');
    const content = fs.readFileSync(claudeMd, 'utf8');

    const required = ['CRITICAL RULES', 'Quick Start', 'Knowledge Map', 'Project Structure'];
    for (const section of required) {
      assert.ok(content.includes(section), `CLAUDE.md.template should include "${section}"`);
    }
  });

  it('TASTE_INVARIANTS.md.template has grep-able rules', () => {
    const inv = path.join(templatesDir, 'TASTE_INVARIANTS.md.template');
    const content = fs.readFileSync(inv, 'utf8');

    assert.ok(content.includes('**Grep**:'), 'Should have Grep patterns');
    assert.ok(content.includes('**Why**:'), 'Should have Why explanations');
    assert.ok(content.includes('**Fix**:'), 'Should have Fix instructions');
  });
});
```

---

## 5. 测试基础设施

```javascript
// test-utils/setup.js
const fs = require('fs');
const path = require('path');

/**
 * Create a minimal project fixture for testing
 */
function createProjectFixture(type, dir) {
  fs.mkdirSync(dir, { recursive: true });

  const files = {
    ios: ['Package.swift'],
    react: ['package.json'],
    node: ['package.json'],
    rust: ['Cargo.toml'],
    go: ['go.mod'],
    python: ['pyproject.toml'],
    java: ['pom.xml'],
    ruby: ['Gemfile'],
    generic: [],
  };

  for (const f of files[type] || []) {
    fs.writeFileSync(path.join(dir, f), '');
  }

  if (type === 'react' || type === 'node') {
    const pkg = type === 'react'
      ? { name: 'react-app', dependencies: { react: '^18' } }
      : { name: 'node-app' };
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg));
  }

  // Initialize git for gitignore tests
  try {
    require('child_process').execSync('git init', { cwd: dir, stdio: 'ignore' });
  } catch { /* ignore */ }

  return dir;
}

/**
 * Clean up a project fixture
 */
function cleanupFixture(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

/**
 * Check if a file is executable
 */
function isExecutable(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.mode & 0o111) !== 0;
}

module.exports = {
  createProjectFixture,
  cleanupFixture,
  isExecutable,
};
```

---

## 6. 运行测试

### package.json scripts

```json
{
  "scripts": {
    "test": "node --test tests/**/*.test.js",
    "test:unit": "node --test tests/unit/**/*.test.js",
    "test:integration": "node --test tests/integration/**/*.test.js",
    "test:e2e": "node --test tests/e2e/**/*.test.js",
    "test:watch": "node --test --watch tests/**/*.test.js",
    "test:coverage": "c8 node --test tests/**/*.test.js"
  }
}
```

### CI 集成 (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
```

---

## 7. 测试原则

1. **隔离性** — 每个测试用独立临时目录
2. **确定性** — 不依赖外部网络、环境变量
3. **快速反馈** — Unit < 100ms, Integration < 2s, E2E < 10s
4. **真实文件系统** — 不用 mock，用真实 tmpdir（更可靠）
5. **清理保证** — `afterEach` 总是清理，即使测试失败
