/**
 * Post-install hook for claude-infra
 * Runs after npm install to guide users on plugin registration
 */

const path = require('path');

const pluginDir = path.resolve(__dirname, '..');

console.log('\n🏗️  claude-infra v2.0.0 installed!\n');
console.log('Claude Code Plugin for scaffolding .claude/ infrastructure.\n');
console.log('To use this plugin in Claude Code:');
console.log('');
console.log('  Method 1 — Load from directory:');
console.log(`    claude --plugin-dir ${pluginDir}`);
console.log('');
console.log('  Method 2 — Add to .claude/settings.json:');
console.log('    {');
console.log('      "plugins": [');
console.log('        {');
console.log(`          "name": "claude-infra",`);
console.log(`          "source": "${pluginDir}"`);
console.log('        }');
console.log('      ]');
console.log('    }');
console.log('');
console.log('Then in Claude Code, use:');
console.log('  /claude-infra:init    — Scaffold .claude/ in current project');
console.log('  /claude-infra:audit   — Run health check');
console.log('  /claude-infra:doctor  — Diagnose + auto-fix');
console.log('  /claude-infra:upgrade — Upgrade to latest');
console.log('  /claude-infra:status  — Show installation status');
console.log('');
console.log('Or use the CLI directly:');
console.log('  npx claude-infra init');
console.log('  npx claude-infra audit');
console.log('');
console.log('📖 Documentation: https://github.com/susuyan/claude-infra#readme');
console.log('');
