---
title: CamLock Android Parental Lock App
summary: Built a privacy-first Android parental lock that recognises enrolled children on the front camera and locks the phone to calls only, with every face check kept on-device.
lane: personal
featured: true
status: in-progress
startDate: 'Sep 2026'
endDate: 'present'
stack:
  - Android
  - Kotlin
  - Jetpack Compose
  - CameraX
  - ML Kit
  - LiteRT
  - Hilt
  - Room
  - Astro
impact:
  - Built a signed 1.0.0 release candidate for Android 8.0+ that enrols up to six children and locks the phone to calls only when one of them picks it up.
  - Kept all face processing on-device with no internet permission, accounts, ads, or analytics, and encrypted face templates with AES-GCM under an Android Keystore key.
  - Gave parents an audit trail with per-lock activity history, CSV export, tamper alerts, a tracking-only mode, and per-child lock-screen messages.
links:
  live: https://camlock-studio.github.io/
---

## Problem

Parents who share a phone with young children need a lock that reacts to who is holding the device, without handing face data to a cloud service or adding accounts, subscriptions, and ads.

## Approach

Built CamLock as a single-module Kotlin app with Jetpack Compose and Material 3. CameraX feeds the front camera to ML Kit face detection, and a LiteRT SFace model matches faces against encrypted templates stored locally in Room. Locking triggers on screen-on, unlock, and app switches, the lock screen exposes calls only, and parents unlock with a strong biometric with no PIN fallback. Hilt wires the services, and a GitHub Actions pipeline runs unit, emulator, and Firebase Test Lab checks. The product site is an Astro build on GitHub Pages with privacy and support pages.

## Result

CamLock is a one-time-purchase parental lock heading to Google Play. It treats itself honestly as a deterrent that keeps a record, not a jail, and it never sends face data off the phone.
