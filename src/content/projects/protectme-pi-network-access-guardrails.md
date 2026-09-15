---
title: ProtectMe Network Access Guardrails for Pi
summary: Built a Pi extension that checks supported agent and user shell network requests against global and project allow lists before execution.
lane: personal
featured: false
status: in-progress
startDate: 'Jul 2026'
endDate: 'present'
stack:
  - Pi
  - TypeScript
  - Node.js
  - npm
  - Network Security
  - Shell
impact:
  - Published ProtectMe as a scoped npm package with global, project-local, one-run, Git, and local checkout install paths.
  - Guarded curl, wget, http, and https requests, including approved wrappers and options that can introduce additional destinations.
  - Added default-block allow-list policy, one-time or persisted approval flows, and bounded local logs that redact common credential-bearing fragments.
links:
  github: https://github.com/senad-d/protectme
  npm: https://www.npmjs.com/package/@senad-d/protectme
---

## Problem

Coding agents and direct terminal commands can contact unapproved destinations, creating accidental data exposure and dependency-download risks that are difficult to review after execution.

## Approach

Built ProtectMe as a Pi event guard that inspects supported request-making shell commands, extracts destinations, and checks them against normalized global and trusted project allow lists. Unknown hosts fail closed, while interactive approvals can permit one request or persist a narrow host decision without storing secrets.

## Result

ProtectMe adds transparent network-destination control to supported Pi shell flows with project-aware policy and secret-conscious audit logs, while clearly remaining a guardrail rather than a firewall or sandbox.
