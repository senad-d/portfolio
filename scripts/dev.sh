#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
force="false"
args=()

for arg in "$@"; do
  case "$arg" in
    --force)
      force="true"
      ;;
    *)
      args+=("$arg")
      ;;
  esac
done

existing_pids="$(pgrep -f "node .*${project_root}/node_modules/.bin/astro dev" || true)"

if [[ "$force" != "true" ]] && [[ -n "$existing_pids" ]]; then
  pids_csv="$(echo "$existing_pids" | paste -sd ',' -)"
  echo "[dev] Astro dev already running for this project (PID(s): $pids_csv)."
  echo "[dev] Stop the running process before starting a new one to avoid .astro write races."
  echo "[dev] If you intentionally need a second instance, run: npm run dev -- --force"
  exit 0
fi

mkdir -p "$project_root/.astro"
exec "$project_root/node_modules/.bin/astro" dev "${args[@]}"
