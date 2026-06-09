# Security Policy

## Scope

This repository contains the static marketing site for ParkHub
(`nash87.github.io/parkhub-site`). It is a build-time Astro + React project
that produces static HTML/CSS/JS — there is no backend, no database, and no
user-submitted data is processed here.

Security vulnerabilities in the ParkHub applications themselves belong in the
relevant app repositories:

- **Rust edition** — [nash87/parkhub-rust](https://github.com/nash87/parkhub-rust/security/advisories/new)
- **PHP edition** — [nash87/parkhub-php](https://github.com/nash87/parkhub-php/security/advisories/new)

## Reporting a Vulnerability in This Site

If you find a vulnerability specific to the marketing site (e.g. a compromised
third-party asset that the site loads, a malicious redirect, or a supply-chain
issue in the Astro build pipeline), please open a
[private security advisory](https://github.com/nash87/parkhub-site/security/advisories/new)
rather than a public issue.

Include:
- What you found and where
- Steps to reproduce or a minimal proof of concept
- Your assessment of impact

### Response times

| Severity | Acknowledgement | Resolution |
|----------|----------------|------------|
| High     | Within 48 hours | Within 14 days |
| Medium   | Within 72 hours | Within 30 days |
| Low      | Within 1 week   | Next release |

Reporters are credited in release notes unless anonymity is requested.

## Supply Chain

Build dependencies are pinned in `package-lock.json`. We review `npm audit`
output before each release. The GitHub Actions deploy workflow
(`.github/workflows/deploy.yml`) uses pinned SHA refs for all third-party
actions.
