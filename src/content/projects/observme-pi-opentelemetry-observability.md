---
title: ObservMe OpenTelemetry for Pi Agent Sessions
summary: Built a Pi extension that exports privacy-conscious traces, metrics, and logs for agent sessions to standard observability backends.
lane: personal
featured: true
status: in-progress
startDate: 'Jul 2026'
endDate: 'present'
stack:
  - Pi
  - TypeScript
  - Node.js
  - npm
  - OpenTelemetry
  - Grafana
impact:
  - Published ObservMe as a scoped npm package with global, project-local, one-run, Git, and local checkout install paths.
  - Instrumented session, turn, model, tool, shell, compaction, branch, workflow, and multi-agent lineage events as OTLP traces, metrics, and logs.
  - Preserved coding flow with fail-open exporters and privacy-first defaults that exclude prompts, responses, tool payloads, and shell content unless explicitly enabled.
links:
  github: https://github.com/senad-d/ObservMe
  npm: https://www.npmjs.com/package/@senad-d/observme
---

## Problem

Multi-step coding-agent sessions are difficult to troubleshoot because model calls, tools, shell activity, compaction, and child-agent work span one workflow without a shared operational view.

## Approach

Built ObservMe as a Pi extension that maps lifecycle and agent events to OpenTelemetry traces, metrics, and logs, exports them through bounded OTLP pipelines, and propagates agent lineage plus W3C trace context across subagent processes. Content capture remains disabled by default and enabled data passes through redaction and path scrubbing.

## Result

ObservMe makes Pi workflows observable in standard Collector and Grafana stacks without blocking sessions when telemetry is unavailable or collecting prompt and tool content by default.
