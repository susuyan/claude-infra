#!/bin/bash
# Branch Protection Hook (PreToolUse)
# Warns when editing on protected branches
set -euo pipefail
PROTECTED_BRANCHES=("main" "master" "develop" "release")
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
[ -z "$CURRENT_BRANCH" ] && exit 0
IS_PROTECTED=false
for branch in "${PROTECTED_BRANCHES[@]}"; do
    [ "$CURRENT_BRANCH" = "$branch" ] && IS_PROTECTED=true && break
done
[ "$IS_PROTECTED" = false ] && exit 0
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  PROTECTED BRANCH WARNING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You are editing files on the '$CURRENT_BRANCH' branch."
echo "This is a protected branch - direct edits are discouraged."
echo ""
echo "Consider:"
echo "  1. Create a feature branch: git checkout -b feature/description"
echo "  2. Make changes on the feature branch"
echo "  3. Create a PR to merge into $CURRENT_BRANCH"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
exit 0
