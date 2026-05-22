#!/usr/bin/env bash
set -euo pipefail

host="${LIGHTHOUSE_HOST:-127.0.0.1}"
port="${LIGHTHOUSE_PORT:-4173}"
base_path="${LIGHTHOUSE_BASE_PATH:-/portfolio/}"
url="${LIGHTHOUSE_URL:-http://${host}:${port}${base_path}}"
output_file="${LIGHTHOUSE_OUTPUT:-/tmp/lighthouse-portfolio.json}"

preview_log="/tmp/portfolio-preview.log"
preview_pid=""

cleanup() {
  if [[ -n "$preview_pid" ]] && kill -0 "$preview_pid" >/dev/null 2>&1; then
    kill "$preview_pid" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

echo "[lighthouse] Building production assets..."
npm run build >/dev/null

echo "[lighthouse] Starting preview server at http://${host}:${port} ..."
npm run preview -- --host "$host" --port "$port" >"$preview_log" 2>&1 &
preview_pid="$!"

is_ready="false"
for _ in {1..40}; do
  if curl -fsS "$url" >/dev/null 2>&1; then
    is_ready="true"
    break
  fi
  sleep 1
done

if [[ "$is_ready" != "true" ]]; then
  echo "[lighthouse] Preview server did not become ready at $url" >&2
  echo "[lighthouse] Inspect logs at $preview_log" >&2
  exit 1
fi

echo "[lighthouse] Running Lighthouse on $url ..."
npx --yes lighthouse "$url" \
  --quiet \
  --chrome-flags='--headless=new --no-sandbox' \
  --only-categories=accessibility,best-practices,seo,performance \
  --output=json \
  --output-path="$output_file"

LIGHTHOUSE_REPORT_PATH="$output_file" node <<'NODE'
const fs = require('fs');

const reportPath = process.env.LIGHTHOUSE_REPORT_PATH;
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const categories = report.categories;

const scores = {
  performance: Math.round(categories.performance.score * 100),
  accessibility: Math.round(categories.accessibility.score * 100),
  bestPractices: Math.round(categories['best-practices'].score * 100),
  seo: Math.round(categories.seo.score * 100),
};

const thresholds = {
  performance: 80,
  accessibility: 95,
  bestPractices: 95,
  seo: 95,
};

console.log('[lighthouse] Scores:', scores);

const failures = Object.entries(thresholds)
  .filter(([metric, minimum]) => scores[metric] < minimum)
  .map(([metric, minimum]) => `${metric} ${scores[metric]} < ${minimum}`);

if (failures.length > 0) {
  console.error(`[lighthouse] Threshold check failed: ${failures.join(', ')}`);
  process.exit(1);
}
NODE

echo "[lighthouse] Passed thresholds. Report saved to $output_file"
