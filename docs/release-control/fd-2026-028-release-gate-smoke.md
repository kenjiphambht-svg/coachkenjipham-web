# FD-2026-028 — Release Control Smoke Marker

Purpose: non-runtime acceptance-test marker for Founder Directive `P01 — FOUNDER DIRECTIVE — TÁCH MERGE / WEBSITE RELEASE / DATABASE MIGRATION v1.0 — 2026-08-15`.

This file intentionally changes no frontend/runtime/database/provider behavior.

Acceptance sequence:
1. branch push must create a Vercel Preview;
2. after Vercel Production `Auto-assign Custom Production Domains` is disabled, merging this reviewed branch into `main` must create at most a staged Production deployment and must not repoint `coachkenjipham.com`;
3. only explicit Founder-approved promotion of the exact staged deployment may repoint the website Production domain;
4. neither merge nor website promotion may execute a Production database migration.

No Production DB migration, provider activation, real customer/child data, or WO-05 is authorized by this marker.
