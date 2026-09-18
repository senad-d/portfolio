---
title: GuardMe Pi Tool-Call Safety Guardrails
summary: Built a Pi extension that enforces deny-first policy for shell and filesystem tool calls with YAML rules, path protections, and approval flows.
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
  - YAML
  - Security
  - AI Tooling
impact:
  - Published GuardMe as a scoped npm package with global, project-local, one-run, Git, and local checkout install paths for Pi.
  - Reduced accidental risky model actions with deny-first shell and filesystem guards for cloud CLIs, credentials, `.git`, `.env`, destructive commands, and sensitive paths.
  - Added a policy-driven approval workflow that merges global and project YAML rules, tracks warned fingerprints, and supports safe one-time or persisted decisions.
links:
  github: https://github.com/senad-d/GuardMe
  npm: https://www.npmjs.com/package/@senad-d/guardme
---

## Problem

Coding agents can call powerful local shell and filesystem tools with full user permissions, so a mistaken or overly broad model request can read secrets, mutate protected files, or run risky commands before the user notices.

## Approach

Built GuardMe as a Pi extension that checks shell and file tool calls before execution. It merges global and project YAML policy, evaluates compound shell commands by executable segment, protects sensitive paths and generated shell-like content, and uses in-session approval only after first blocking and coaching risky actions that are not hard-denied.

## Result

GuardMe gives Pi sessions IAM-like deny-first guardrails while staying configurable through `/guardme` and policy files, making local AI-assisted development safer without presenting itself as an OS sandbox.
