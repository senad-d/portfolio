---
title: IssueMe GitHub Issue Management for Pi
summary: Built a Pi extension that gives coding agents repository-scoped GitHub issue workflows through structured API tools and bounded local context.
lane: personal
featured: false
status: in-progress
startDate: 'Jun 2026'
endDate: 'present'
stack:
  - Pi
  - TypeScript
  - Node.js
  - npm
  - GitHub REST API
  - GraphQL
impact:
  - Published IssueMe as a scoped npm package with global, project-local, one-run, Git, and local checkout install paths.
  - Exposed 29 tools for issues, labels, milestones, comments, assignees, Projects v2, sub-issues, development links, deletion, and bulk workflows.
  - Kept agent context bounded with a local issue cache while protecting tokens and requiring explicit confirmation for destructive taxonomy and deletion operations.
links:
  github: https://github.com/senad-d/IssueMe
  npm: https://www.npmjs.com/package/@senad-d/issueme
---

## Problem

Agents need complete issue context to plan and track work, but raw GitHub API usage creates authentication, repository-boundary, pagination, destructive-action, and oversized-response risks.

## Approach

Built IssueMe as a Pi extension that resolves the active repository, communicates with GitHub through REST and GraphQL APIs, stores bounded non-secret issue context locally, and exposes structured tools for issue lifecycle, planning metadata, Projects v2, sub-issues, and linked development.

## Result

IssueMe provides an agent-friendly issue management layer that supports discovery and updates from Pi while keeping repository scope, local cache behavior, token handling, and destructive confirmations explicit.
