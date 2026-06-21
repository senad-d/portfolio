---
title: MicMe Local Voice-to-Text Pi Extension
summary: Built a local-first voice-to-text extension for Pi that records coding prompts, transcribes locally, and inserts reviewed transcripts into the editor.
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
  - ffmpeg
  - whisper.cpp
impact:
  - Published MicMe as a scoped npm package with global, project-local, one-run, Git, and local checkout install paths.
  - Preserved privacy by keeping speech-to-text local by default with ffmpeg, whisper.cpp, Python Whisper, or custom backends.
  - Improved coding-agent prompt flow with toggle recording, review-first transcript insertion, device discovery, configuration, and diagnostics.
links:
  github: https://github.com/senad-d/micme
  npm: https://www.npmjs.com/package/@senad-d/micme
---

## Problem

Writing longer coding prompts in a terminal can interrupt flow, while cloud dictation tools add privacy concerns and extra moving parts.

## Approach

Built MicMe as a Pi extension that records microphone input with ffmpeg, transcribes locally through whisper.cpp, Python Whisper, or a custom backend, and pastes the transcript into Pi for review before submission. Added configuration, device discovery, diagnostics, and npm publishing workflows so the package is practical to install and maintain.

## Result

MicMe provides a local-first voice input workflow for coding prompts, letting users speak, review, and submit transcripts without leaving the Pi editor.
