---
document_id: ADR-002
title: Workspace Abstraction Over Tenant
version: 1.0.0
status: Accepted
owner: Architecture Review Board
review_date: 2026-07-07
last_updated: 2026-07-07
related_documents:
  - ADR-001
  - IE-0008
  - IE-1501
---

# ADR-002: Workspace Abstraction Over Tenant

## Status

**Accepted** — 2026-07-07

## Context

Users think in terms of **which product** they are using and **which business** they are managing — not internal tenant identifiers. The frontend already implements `WorkspaceContext` (tenant + business + product) but inconsistently labels UI as "tenant" or "platform shell."

Backend tenancy resolution via `X-Tenant-ID` must remain unchanged for API compatibility.

## Decision

Define **Workspace** as the user-facing session scope:

```
Workspace = Current Product + Current Business
```

**Rules:**

1. Never expose "Tenant" in end-user UI copy, navigation, or error messages.
2. `tenantId` remains internal — used for API headers and `WorkspaceContext` bootstrap only.
3. Display format: `{ProductName} · {BusinessName}` (e.g. "AppointIE · Empire Salon").
4. SDK type `WorkspaceSnapshot` documents the contract; frontend `workspaceModel.ts` implements helpers.

Tenant switching remains a platform-admin concern (future); business and product switching are user-facing.

## Rationale

- Matches user mental model from product vision.
- Zero backend API changes.
- Builds on existing `WorkspaceContext` and localStorage keys.

## Consequences

**Positive**

- Consistent UX across header, sidebar, and dashboard.
- Clear separation: tenant = isolation, workspace = experience.

**Negative**

- Multi-tenant users (multiple owned tenants) still lack a tenant picker UI — documented as future admin capability.

## Follow-up Actions

- Add platform-admin tenant switcher (separate from workspace switcher).
- Align onboarding copy with workspace terminology.
