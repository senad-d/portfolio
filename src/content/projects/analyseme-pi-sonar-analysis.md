---
title: AnalyseMe Sonar Quality Analysis for Pi
summary: Built a Pi extension that lets coding agents inspect SonarQube and SonarCloud quality data and optionally submit a fresh local scan.
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
  - SonarQube
  - SonarCloud
impact:
  - Published AnalyseMe as a scoped npm package with global, project-local, one-run, Git, and local checkout install paths.
  - Delivered six tools and two commands for quality gates, metrics, issues, source context, security hotspots, guidance, and fresh scanner submissions.
  - Kept analysis reads repository-safe and masked Sonar tokens across command output, tool results, errors, and tests.
links:
  github: https://github.com/senad-d/analyseme
  npm: https://www.npmjs.com/package/@senad-d/analyseme
---

## Problem

Code-quality findings often live outside the coding-agent workflow, forcing developers to switch context and manually translate quality gates, issue locations, rule guidance, and security hotspots into actionable changes.

## Approach

Built AnalyseMe as a Pi extension that resolves project and branch context, reads SonarQube or SonarCloud quality data, returns bounded issue and hotspot details with source guidance, and optionally invokes the local SonarScanner to submit a requested fresh analysis. Credentials stay in environment variables and are masked from outputs.

## Result

AnalyseMe brings quality-gate and finding context into Pi through read-focused tools, with one explicit scan path for validating changes against the configured Sonar server.
