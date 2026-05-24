---
title: Compli.nl AWS Observability Baseline
summary: Unified AWS monitoring into a shared observability baseline that improved alert quality and sped up incident triage.
lane: professional
featured: false
status: completed
startDate: 'Feb 2023'
endDate: 'Feb 2023'
stack:
  - AWS CloudWatch
  - Grafana
  - InfluxDB
  - Telegraf
  - Slack
  - SNS
impact:
  - Centralized CloudWatch telemetry into shared Grafana dashboards used across workloads.
  - Introduced Slack-routed alert workflows with clearer ownership and faster first response.
  - Extended diagnostic depth by combining CloudWatch with InfluxDB and Telegraf metrics.
links:
  caseStudy: https://www.linkedin.com/in/senad-dizdarevic-devops
---

## Problem

Monitoring was fragmented across services, slowing incident triage and reducing confidence in alerts.

## Approach

Designed a centralized observability layer with CloudWatch as the primary source and Grafana as the shared visualization surface. Added InfluxDB and Telegraf for deeper telemetry coverage, then connected alerting to Slack support channels for faster team response.

## Result

Teams moved to a consistent monitoring model with clearer alert ownership, less noisy escalation, and a faster path from detection to resolution.
