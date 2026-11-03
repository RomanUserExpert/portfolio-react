#!/usr/bin/env bash
# Runs a Figma build script through Figmosha with lib.js prepended.
#   scripts/figma/run.sh scripts/figma/build-foundations.js [extra figmosha args]
# FIGMOSHA_DIR defaults to the local "General" copy; FIGMOSHA_SESSION picks the Figma file.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
script="$1"; shift
FIGMOSHA_DIR="${FIGMOSHA_DIR:-E:/Work/Personal/Figmosha - general}"
export FIGMOSHA_SESSION="${FIGMOSHA_SESSION:-Folio website}"
tmp="$(mktemp --suffix=.js)"
trap 'rm -f "$tmp"' EXIT
cat "$here/lib.js" "$script" > "$tmp"
"$FIGMOSHA_DIR/venv/Scripts/python.exe" "$FIGMOSHA_DIR/figmosha.py" exec -t 240 --file "$tmp" "$@"
