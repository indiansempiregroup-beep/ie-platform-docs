---
document_id: ADR-005
title: Business Resolution Middleware
version: 1.0.0
status: Accepted
owner: Architecture Review Board
review_date: 2026-07-07
last_updated: 2026-07-07
related_documents:
  - ADR-002
  - IE-1502
---

# ADR-005: Business Resolution Middleware

## Status

**Accepted** — 2026-07-07

## Context

Analytics, calendar, and platform media views expect `request.current_business`, but only tenant middleware was active. The frontend workspace switcher knew the active business but did not send it to the API.

## Decision

1. Add `BusinessResolutionMiddleware` after `TenantResolutionMiddleware`.
2. Resolve business from optional `X-Business-ID` header.
3. Fall back to the tenant's default business (first accessible) when header is absent — **backward compatible**.
4. Frontend `useApiClient()` sends `X-Business-ID` from `WorkspaceContext`.

## Consequences

**Positive**

- Server-side views can rely on `request.current_business`.
- Multi-business tenants get correct scoping when header is sent.

**Negative**

- Clients without the header still get default business (existing behavior).

## Follow-up Actions

- Optionally use `current_business` as fallback in list endpoints when `?business=` query param is omitted.
