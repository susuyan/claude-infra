#!/bin/bash

# Post-Tool-Use Tracker Hook
# Logs all file modifications for monitoring and debugging

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/../logs"
LOG_FILE="$LOG_DIR/tool-usage.log"

mkdir -p "$LOG_DIR"

EVENT_DATA=$(cat)
TOOL_NAME=$(echo "$EVENT_DATA" | jq -r '.tool // "unknown"')

case "$TOOL_NAME" in
    Edit|Write|MultiEdit|NotebookEdit) ;;
    *) exit 0 ;;
esac

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
FILE_PATHS=""

case "$TOOL_NAME" in
    Edit|Write|NotebookEdit)
        FILE_PATH=$(echo "$EVENT_DATA" | jq -r '.parameters.file_path // .parameters.notebook_path // "unknown"')
        FILE_PATHS="$FILE_PATH"
        ;;
    MultiEdit)
        FILE_PATHS=$(echo "$EVENT_DATA" | jq -r '.parameters.edits[]?.file_path // empty' | tr '\n' ', ' | sed 's/,$//')
        ;;
esac

[ -z "$FILE_PATHS" ] && exit 0

echo "[$TIMESTAMP] $TOOL_NAME: $FILE_PATHS" >> "$LOG_FILE"

for file in $(echo "$FILE_PATHS" | tr ',' '\n'); do
    file=$(echo "$file" | xargs)
    AREA="unknown"
    # Customize area detection for your project structure
    if echo "$file" | grep -q "src/"; then
        AREA="Source"
    elif echo "$file" | grep -q "test/\|tests/\|spec/"; then
        AREA="Tests"
    elif echo "$file" | grep -q "\.claude/"; then
        AREA="Claude Config"
    fi
    echo "  └─ Area: $AREA, File: $file" >> "$LOG_FILE"
done

exit 0
