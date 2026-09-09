#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
case "${1:-}" in
  install)
    node --version
    command -v rustc >/dev/null || { echo "rustc is required: https://rustup.rs" >&2; exit 1; }
    rustc --version
    echo "No packages to install — clonetax is zero-dependency."
    ;;
  example) node scripts/extract.mjs ;;
  test)    node --test test/*.test.mjs ;;
  *) echo "usage: bash scripts/dev.sh {install|example|test}" >&2; exit 2 ;;
esac
