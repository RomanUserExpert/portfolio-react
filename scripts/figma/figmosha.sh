#!/usr/bin/env bash
# Plain Figmosha call (no lib.js prepended, unlike run.sh): for self-contained scripts such as
# sync-tokens.js and check-tokens.js.   scripts/figma/figmosha.sh exec --file <script> [args]
# FIGMOSHA_DIR defaults to the local "General" copy; FIGMOSHA_SESSION picks the Figma file.
set -euo pipefail
FIGMOSHA_DIR="${FIGMOSHA_DIR:-E:/Work/Personal/Figmosha - general}"
export FIGMOSHA_SESSION="${FIGMOSHA_SESSION:-Folio website}"
exec "$FIGMOSHA_DIR/venv/Scripts/python.exe" "$FIGMOSHA_DIR/figmosha.py" "$@"
