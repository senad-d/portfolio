---
title: CommitMe Pi Commit Assistant
summary: Built a Pi extension that turns local git changes into safe Lightweight Conventional Commit messages and creates local commits.
lane: personal
featured: true
status: in-progress
startDate: 'Jun 2026'
endDate: 'present'
stack:
  - Pi
  - TypeScript
  - Node.js
  - npm
  - Git
  - LLM Tooling
impact:
  - Published CommitMe as a scoped npm package with slash-command, agent-tool, global, project-local, one-run, Git, and local checkout install paths.
  - Improved commit quality by gathering staged and unstaged git context, trimming noisy diffs, accepting steering text, and producing Lightweight Conventional Commit messages.
  - Added safety guardrails that redact sensitive context, refuse known secret files and high-confidence tokens, recheck repository status before staging, and never push.
links:
  github: https://github.com/senad-d/CommitMe
  npm: https://www.npmjs.com/package/@senad-d/commitme
---

## Problem

Turning a busy local diff into a clear commit message takes time, and inconsistent commit wording becomes more likely when work spans staged, unstaged, generated, or noisy files.

## Approach

Built CommitMe as a Pi extension and npm package that reads local git status, staged and unstaged paths, diff stats, redacted diff excerpts, and safe project metadata. It builds a compact prompt for the active Pi model, supports optional steering text and confirmation, validates the Lightweight Conventional Commit shape, then stages changes and creates a local commit without pushing.

## Result

CommitMe provides a repeatable local workflow for drafting, reviewing, and creating clear commits from actual repository changes while keeping safety checks, redaction, and no-telemetry behavior built in.
