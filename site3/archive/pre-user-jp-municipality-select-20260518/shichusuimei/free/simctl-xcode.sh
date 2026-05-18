#!/bin/zsh

set -euo pipefail

XCODE_DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer"

if [[ ! -d "$XCODE_DEVELOPER_DIR" ]]; then
  echo "Xcode developer directory not found: $XCODE_DEVELOPER_DIR" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "Usage: ./simctl-xcode.sh <simctl args...>" >&2
  echo "Example: ./simctl-xcode.sh list devices available" >&2
  exit 1
fi

DEVELOPER_DIR="$XCODE_DEVELOPER_DIR" xcrun simctl "$@"
