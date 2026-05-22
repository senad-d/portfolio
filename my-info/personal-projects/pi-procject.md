# pi-code

DevOps-focused **Pi workspace** for building and running project-local automation.

This repository contains custom Pi extensions, agent orchestration configs, guardrails, skills, themes, and tests for safe, repeatable coding and operations workflows.

## What this repo can do

- Run multi-agent workflows (scout → plan → build → review → test → docs).
- Run a single specialist agent for focused tasks.
- Run multiple agents in parallel for fast research/QA.
- Enforce safety guardrails for filesystem writes, destructive commands, and network hosts.
- Query AWS documentation/SOP/region fixtures via deterministic tools.
- Generate concise summaries from text or files.
- Create commit messages from staged diffs (LLM-first with deterministic fallback).
- Track token/cost usage across session, project, and global scopes.

## Extension features

| Extension | Capability |
|---|---|
| `.pi/extensions/agent-orchestrator/` | Core orchestration tools: `dispatch_agent`, `run_chain`, `query_experts`; run registry; chain resume/checkpoints; output inspection commands. |
| `.pi/extensions/chain-selector.ts` | UX commands for execution: `/chain`, `/agent-run`, `/agents-run` with selection/autocomplete flow. |
| `.pi/extensions/aws-knowledge/` | Fixture-backed AWS tools: docs search/read/recommend, region listing, regional availability, SOP retrieval. |
| `.pi/extensions/concise-summarize.ts` | `summarize_concise` tool + `/summarize` command (LLM-first, deterministic fallback). |
| `.pi/extensions/git-commit-from-diff.ts` | `commit_from_diff` tool + `/git-commit` and `/git-commit-exit`. |
| `.pi/extensions/token-insights/` | Token/cost telemetry (`token_usage_report`, `/token-usage`, `/token-usage-backfill`). |
| `.pi/extensions/cwd-write-guard.ts` | Blocks writes outside the session CWD (except configured safe temp roots). |
| `.pi/extensions/damage-control.ts` | Blocks destructive patterns and protected path operations. |
| `.pi/extensions/website-allowlist.ts` | Enforces outbound host allowlist for network-intent operations. |
| `.pi/extensions/chain-audio-notify.ts` | Plays completion audio when chain runs finish. |
| `.pi/extensions/chain-stop-after.ts` | Optional auto-stop behavior after chain completion. |

## Agents, teams, and chains

Configured under `.pi/agents/`:

- **Teams:** `core`, `code-fix`, `planning`, `qa-cycle`, `web`
- **Chains:**
  - `core-flow` — end-to-end implementation flow
  - `planning-research` — scout + browser research + plan review
  - `qa-cycle` — QA/test/fix/retest report flow

## Repo layout

- `.pi/extensions/**` — custom Pi extensions/tools/commands
- `.pi/agents/**` — agent definitions, teams, chain pipelines
- `.pi/skills/**` — reusable skills (currently `playwright-cli`)
- `.pi/themes/*.json` — custom TUI themes
- `commands/` — prompt template root
- `docs/` — runbooks and design docs
- `tests/extensions/*.test.ts` — extension test suite

## Quick start

```bash
npm install
npm test
```

Then open Pi in this repo and reload local resources:

```text
/reload
```

Example commands:

```text
/chain core-flow improve token usage reporting docs
/agent-run builder implement retry handling in chain status
/agents-run team:qa-cycle validate guardrail regressions
/token-usage scope:project
```

## Safety model

Guardrails are enforced through:

- `.pi/damage-control-rules.yaml`
- `.pi/website-allowlist.yaml`
- extension-level write/network checks

Design goal: **safe, reversible, auditable changes**.

## Useful docs

- `docs/agent-execution-and-output.md`
- `docs/chain-failure-recovery.md`
- `docs/git-commit-from-diff.md`
- `docs/concise-summarize.md`
- `docs/pi-capability-matrix.md`
