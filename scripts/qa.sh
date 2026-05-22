#!/usr/bin/env bash
set -euo pipefail

skip_format="false"

for arg in "$@"; do
  case "$arg" in
    --skip-format)
      skip_format="true"
      ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Usage: npm run qa [-- --skip-format]" >&2
      exit 1
      ;;
  esac
done

if [[ "$skip_format" != "true" ]]; then
  echo "[qa] Formatting files..."
  npm run format
else
  echo "[qa] Skipping format step"
fi

echo "[qa] Running validate gate..."
npm run validate

echo "[qa] Complete"
