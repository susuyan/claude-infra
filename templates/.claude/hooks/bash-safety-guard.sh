#!/bin/bash
# Bash Safety Guard (PreToolUse on Bash)
# Blocks bash patterns that trigger un-bypassable security prompts.
set -eo pipefail
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null || echo "")
if [[ "$COMMAND" =~ \\?\; ]] && [[ "$COMMAND" =~ -exec ]]; then
    cat <<'BLOCK'
{"decision": "block", "reason": "find -exec with \\; triggers a security prompt. Use 'find ... -exec cmd {} +' or 'find ... | xargs cmd' instead."}
BLOCK
    exit 0
fi
exit 0
