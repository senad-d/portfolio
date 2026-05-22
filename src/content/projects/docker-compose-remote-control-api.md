---
title: Docker Compose Remote Control API
summary: Developed a Dockerized Flask API behind Gunicorn and Nginx for authenticated remote docker-compose operations.
lane: personal
featured: false
status: completed
startDate: 'Jun 2024'
endDate: 'Aug 2024'
stack:
  - Python
  - Flask
  - Docker Compose
  - Gunicorn
  - Nginx
  - JWT
impact:
  - Enabled secure remote control of auxiliary container services through REST endpoints.
  - Protected command execution with JWT-based authentication and authorization.
  - Simplified operations with containerized deployment and clear API/Gunicorn/Nginx log paths.
links:
  github: https://github.com/senad-d/DockerComposeAPI
---

## Problem

Operating occasional infrastructure services on remote hosts is inconvenient when shell access is the only control path.

## Approach

Built a REST API with login and command endpoints, constrained execution to docker-compose commands, and packaged the service as Flask + Gunicorn behind Nginx.

## Result

Operators can trigger compose workflows from external tools (for example Grafana buttons) without exposing full interactive shell access.
