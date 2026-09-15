---
title: BranchMe Git Workflow Automation for Pi
summary: Built a Pi extension that verifies repository state and automates branch, worktree, integration, push, and pull request workflows.
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
  - GitHub
impact:
  - Published BranchMe as a scoped npm package with global, project-local, one-run, Git, and local checkout install paths.
  - Exposed 19 agent-callable tools plus a bounded read-only repository snapshot for branch, worktree, integration, push, and pull request workflows.
  - Added strict safety boundaries that verify repository and worktree state, avoid force pushes, and never stage files or create user-authored commits.
links:
  github: https://github.com/senad-d/branchme
  npm: https://www.npmjs.com/package/@senad-d/branchme
---

## Problem

Coding agents need current Git context to work safely, but branch, worktree, and pull request automation can damage local history when repository state or command scope is assumed rather than verified.

## Approach

Built BranchMe as a Pi extension that injects a bounded read-only repository snapshot and exposes strict tools for repository initialization, branch changes, linked worktrees, integration, retirement, remote updates, pushes, and GitHub pull requests. Each mutating workflow validates its repository, cleanliness, branch, and worktree preconditions before acting.

## Result

BranchMe provides a context-aware Git workflow for Pi that supports isolated agent handoffs and pull request delivery while keeping history rewrites explicit and commit creation outside the extension.
