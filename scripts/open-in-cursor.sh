#!/bin/bash

# Script to open the current project in Cursor
# Can be used manually or by the conversion process

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Opening project in Cursor..."
echo "Project directory: $PROJECT_DIR"

# Try to open in Cursor
if command -v cursor &> /dev/null; then
    echo "✅ Opening with Cursor CLI..."
    cursor "$PROJECT_DIR"
elif open -Ra "Cursor" --args "$PROJECT_DIR" 2>/dev/null; then
    echo "✅ Opened with Cursor app!"
else
    echo "⚠️  Cursor not found, opening in Finder instead..."
    open "$PROJECT_DIR"
fi

echo "🎯 Project should now be open for editing!"