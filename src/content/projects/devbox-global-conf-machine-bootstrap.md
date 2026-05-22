---
title: Devbox Global Machine Bootstrap
summary: Automates fresh macOS and Linux workstation setup for DevOps tooling through a reusable shell bootstrap.
lane: personal
featured: false
status: completed
startDate: 'Jan 2025'
endDate: 'Mar 2025'
stack:
  - Bash
  - Linux
  - macOS
  - Git
impact:
  - Reduced manual onboarding effort by automating baseline machine setup steps.
  - Standardized workstation provisioning across macOS and Linux with one entrypoint.
  - Improved setup reliability through explicit OS detection, logging, and error handling.
links:
  github: https://github.com/senad-d/devbox-global-conf
---

## Problem

Setting up a new development machine repeatedly is slow and error-prone, especially across different operating systems.

## Approach

Built a function-based shell bootstrap project that detects the host OS, installs required software, logs progress, and handles failures consistently.

## Result

The project provides a repeatable, low-friction way to prepare DevOps workstations while reducing configuration drift between machines.
