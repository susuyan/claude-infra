#!/bin/bash
# Dangerous Git Guard (PreToolUse on Bash)
# Catches dangerous git patterns that prefix-based deny rules miss.
set -eo pipefail
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null || echo "")
[[ ! "$COMMAND" =~ ^[[:space:]]*git[[:space:]] ]] && exit 0

block() {
    cat <<BLOCK
{"decision": "block", "reason": "$1"}
BLOCK
    exit 0
}

if [[ "$COMMAND" =~ ^[[:space:]]*git[[:space:]]+push ]]; then
    [[ "$COMMAND" =~ --force|\ -f\ |\ -f$|--force-with-lease ]] && block "Force push is forbidden."
fi
[[ "$COMMAND" =~ ^[[:space:]]*git[[:space:]]+reset ]] && block "git reset is forbidden. Use git revert instead."
[[ "$COMMAND" =~ ^[[:space:]]*git[[:space:]]+clean ]] && block "git clean is forbidden. Remove files manually."
[[ "$COMMAND" =~ ^[[:space:]]*git[[:space:]]+checkout[[:space:]]+(--[[:space:]]+)?\.([[:space:]]|$) ]] && block "Destructive git checkout is forbidden."
[[ "$COMMAND" =~ ^[[:space:]]*git[[:space:]]+restore[[:space:]]+\. ]] && block "git restore . is forbidden."
[[ "$COMMAND" =~ ^[[:space:]]*git[[:space:]]+branch[[:space:]]+-D ]] && block "git branch -D is forbidden. Use -d for safe deletion."
exit 0
