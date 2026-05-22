#!/usr/bin/env bash
set -euo pipefail

slug="${1:-}"

if [[ -z "$slug" ]]; then
  echo "Usage: npm run new:project <slug>" >&2
  exit 1
fi

if [[ ! "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Error: slug must use lowercase letters, numbers, and hyphens only." >&2
  exit 1
fi

template="_templates/project-template.md"
target="src/content/projects/${slug}.md"

if [[ ! -f "$template" ]]; then
  echo "Error: template not found at $template" >&2
  exit 1
fi

if [[ -f "$target" ]]; then
  echo "Error: project file already exists: $target" >&2
  exit 1
fi

mkdir -p "$(dirname "$target")"
cp "$template" "$target"

echo "Created: $target"
echo "Next: update frontmatter and content, then run npm run validate"
