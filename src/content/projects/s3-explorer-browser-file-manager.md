---
title: S3 Explorer Browser File Manager
summary: Built a lightweight browser-only S3 manager with session-only credentials and no backend dependency.
lane: personal
featured: false
status: completed
startDate: 'Feb 2025'
endDate: 'Apr 2025'
stack:
  - HTML
  - CSS
  - Amazon S3
  - AWS SDK for JavaScript v2
impact:
  - Enabled direct S3 workflows in the browser, including browse, upload, download, move, and delete.
  - Improved maintainability by refactoring a single-file app into modular CSS and JavaScript assets.
  - Preserved security posture by keeping credentials in memory only and never persisting secrets.
links:
  github: https://github.com/senad-dizdarevic-valcon/s3-explorer
---

## Problem

Managing S3 objects often requires heavyweight tooling, while ad hoc scripts can be difficult for non-CLI users.

## Approach

Implemented a browser-native S3 utility using AWS SDK v2 from a CDN, then expanded UX with breadcrumbs, filtering, previews, multipart uploads, bulk actions, and theme switching.

## Result

The app delivers practical day-to-day S3 operations in a minimal interface with improved code structure and no server-side credential storage.
