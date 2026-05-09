/**
 * Configuration Auditor for claude-infra
 * Validates the integrity and consistency of .claude/ configuration.
 */

const fs = require('fs');
const path = require('path');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(msg) { console.log(msg); }
function ok(msg) { console.log(`  ${C.green}✅ ${msg}${C.reset}`); }
function warn(msg) { console.log(`  ${C.yellow}⚠️  ${msg}${C.reset}`); }
function fail(msg) { console.log(`  ${C.red}❌ ${msg}${C.reset}`); }
function bold(msg) { console.log(`${C.bold}${msg}${C.reset}`); }

const REQUIRED_FILES = [
  'CLAUDE.md',
  'settings.json',
  'settings.local.json',
  'TASTE_INVARIANTS.md',
  'CODE_REVIEW_GUIDE.md',
  'SKILLS_MANAGEMENT_GUIDE.md',
  '.claude-version',
];

const REQUIRED_HOOKS = [
  'skill-activation-prompt.sh',
  'post-tool-use-tracker.sh',
  'branch-protection-pre-edit.sh',
  'dangerous-git-guard.sh',
  'bash-safety-guard.sh',
];

const SKILL_DIRS = [
  'skills/code-review-developer',
  'skills/self-review',
  'skills/confidence-check',
];

function isValidJson(filePath) {
  try {
    JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return true;
  } catch {
    return false;
  }
}

function hasSkillFrontmatter(skillDir) {
  const skillMd = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(skillMd)) return false;
  const content = fs.readFileSync(skillMd, 'utf8');
  return content.startsWith('---') && content.includes('name:') && content.includes('description:');
}

function checkSkillConsistency(claudeDir) {
  const rulesPath = path.join(claudeDir, 'hooks', 'skill-rules.json');
  if (!fs.existsSync(rulesPath)) return { ok: false, msg: 'skill-rules.json not found' };

  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
  const skillsInRules = new Set(Object.keys(rules.skills || {}));
  const skillsDir = path.join(claudeDir, 'skills');
  const skillsOnDisk = new Set();

  if (fs.existsSync(skillsDir)) {
    for (const item of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (item.isDirectory() && !item.name.startsWith('.')) {
        skillsOnDisk.add(item.name);
      }
    }
  }

  const missing = [...skillsInRules].filter(s => !skillsOnDisk.has(s));
  const orphan = [...skillsOnDisk].filter(s => !skillsInRules.has(s) && s !== 'README');

  if (missing.length > 0 || orphan.length > 0) {
    const issues = [];
    if (missing.length) issues.push(`Missing dirs: ${missing.join(', ')}`);
    if (orphan.length) issues.push(`Orphan dirs: ${orphan.join(', ')}`);
    return { ok: false, msg: issues.join('; ') };
  }
  return { ok: true, msg: `All ${skillsInRules.size} skills consistent` };
}

function run(projectRoot, options = {}) {
  const fix = options.fix || false;
  const claudeDir = path.join(projectRoot, '.claude');

  bold(`\n🔍 Claude Code Configuration Audit`);
  log(`   Project: ${projectRoot}`);
  log('');

  let passed = 0, failed = 0, warned = 0;

  // 1. Core files
  bold('📁 Core Files');
  for (const f of REQUIRED_FILES) {
    if (fs.existsSync(path.join(claudeDir, f))) {
      ok(f);
      passed++;
    } else {
      fail(f);
      failed++;
      if (fix && f === '.claude-version') {
        fs.writeFileSync(path.join(claudeDir, f), '2.0.0\n');
        log(`      → Created with default version`);
      }
    }
  }

  // 2. JSON validation
  bold('\n📋 JSON Validation');
  const jsonFiles = [
    ['settings.json', path.join(claudeDir, 'settings.json')],
    ['settings.local.json', path.join(claudeDir, 'settings.local.json')],
    ['skill-rules.json', path.join(claudeDir, 'hooks', 'skill-rules.json')],
  ];
  for (const [name, p] of jsonFiles) {
    if (isValidJson(p)) {
      ok(`${name} is valid JSON`);
      passed++;
    } else {
      fail(`${name} is invalid JSON`);
      failed++;
    }
  }

  // 3. Hooks
  bold('\n🪝 Hooks');
  for (const hook of REQUIRED_HOOKS) {
    const p = path.join(claudeDir, 'hooks', hook);
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      if (stat.mode & 0o111) {
        ok(`hooks/${hook} is executable`);
        passed++;
      } else {
        fail(`hooks/${hook} is not executable`);
        failed++;
        if (fix) {
          fs.chmodSync(p, 0o755);
          log(`      → Fixed permissions`);
        }
      }
    } else {
      fail(`hooks/${hook} missing`);
      failed++;
    }
  }

  // 4. Shared library
  bold('\n📚 Shared Libraries');
  const libDir = path.join(claudeDir, 'hooks', '_lib');
  if (fs.existsSync(path.join(libDir, 'common.sh'))) {
    ok('hooks/_lib/common.sh present');
    passed++;
  } else {
    warn('hooks/_lib/common.sh missing');
    warned++;
  }

  // 5. Skills
  bold('\n🧠 Skills');
  for (const skillDir of SKILL_DIRS) {
    const p = path.join(claudeDir, skillDir);
    if (hasSkillFrontmatter(p)) {
      ok(`${skillDir} has valid SKILL.md`);
      passed++;
    } else {
      fail(`${skillDir} missing or invalid`);
      failed++;
    }
  }

  // 6. Skill consistency
  const consistency = checkSkillConsistency(claudeDir);
  if (consistency.ok) {
    ok(`skill-rules.json ↔ skills/ — ${consistency.msg}`);
    passed++;
  } else {
    fail(`skill-rules.json ↔ skills/ — ${consistency.msg}`);
    failed++;
  }

  // 7. Version
  bold('\n🏷️  Version Tracking');
  const vf = path.join(claudeDir, '.claude-version');
  if (fs.existsSync(vf)) {
    const ver = fs.readFileSync(vf, 'utf8').trim();
    ok(`.claude-version: ${ver}`);
    passed++;
  } else {
    fail('.claude-version missing');
    failed++;
  }

  // 8. Logs
  bold('\n📝 Logs');
  const logsDir = path.join(claudeDir, 'logs');
  const logsGi = path.join(logsDir, '.gitignore');
  if (fs.existsSync(logsDir) && fs.existsSync(logsGi)) {
    ok('logs/ properly configured');
    passed++;
  } else {
    warn('logs/ not fully configured');
    warned++;
    if (fix) {
      fs.mkdirSync(logsDir, { recursive: true });
      fs.writeFileSync(logsGi, '*.log\n!.gitignore\n');
      log(`      → Created logs/ with .gitignore`);
    }
  }

  // Summary
  const total = passed + failed + warned;
  bold(`\n${'='.repeat(50)}`);
  bold(`Summary: ${C.green}${passed} passed${C.reset}, ${C.red}${failed} failed${C.reset}, ${C.yellow}${warned} warned${C.reset} (${total} total)`);

  if (failed === 0) {
    log(`\n${C.green}${C.bold}✅ All critical checks passed!${C.reset}\n`);
  } else {
    log(`\n${C.red}${C.bold}❌ ${failed} check(s) failed.${C.reset}`);
    if (!fix) log('   Run with --fix to attempt automatic repairs.\n');
  }

  return { passed, failed, warned, total };
}

module.exports = { run };
