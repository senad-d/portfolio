---
title: DrawMe Natural-Language Diagramming for Pi
summary: Built a Pi extension that turns natural-language descriptions into validated, editable draw.io diagrams and local image exports.
lane: personal
featured: true
status: in-progress
startDate: 'Aug 2026'
endDate: 'present'
stack:
  - Pi
  - TypeScript
  - Node.js
  - npm
  - draw.io
  - Mermaid
impact:
  - Published DrawMe as a scoped npm package with global, project-local, one-run, Git, and local checkout install paths.
  - Delivered nine agent tools and three commands for planning, authoring, validating, previewing, explaining, and exporting diagrams.
  - Improved diagram accuracy with structural linting, image-aware review, editable exports, and a local index of more than 10,000 official cloud and modeling shapes.
links:
  github: https://github.com/senad-d/DrawMe
  npm: https://www.npmjs.com/package/@senad-d/drawme
---

## Problem

Architecture and workflow diagrams are valuable documentation, but manually laying out editable diagrams and checking connections, geometry, and export quality interrupts development flow.

## Approach

Built DrawMe as a Pi extension that plans diagrams from natural-language prompts, authors draw.io XML or Mermaid, validates each revision with a deterministic structural linter, reviews rendered previews when the active model supports images, and exports editable PNG, SVG, PDF, or JPG deliverables through the local draw.io CLI.

## Result

DrawMe turns a single Pi prompt into a repeatable local diagram workflow with editable source, deterministic validation, exact shape lookup, and multi-format output.
