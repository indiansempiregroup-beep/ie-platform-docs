---
document_id: IE-1502
title: Platform Evolution Migration Strategy
version: 1.0.0
status: Active
owner: Architecture Review Board
review_date: 2026-07-07
last_updated: 2026-07-07
related_documents:
  - IE-1501
  - ADR-001
  - ADR-002
---

# Platform Evolution Migration Strategy

## Principles

1. **Incremental migration** — no big-bang rewrite
2. **API compatibility** — existing clients continue to work
3. **Database compatibility** — additive migrations only unless ADR-approved
4. **Document breaking changes** — do not silently implement them

## Phase 0 — Complete (This Milestone)

| Item | Action | Risk |
|------|--------|------|
| Platform Core registry | Document + `registry.py` / `platform.ts` | None |
| Workspace UX | Header/sidebar use Product · Business label | Low |
| ADRs 001–004 | Accepted | None |
| Reports route | Placeholder page (was broken) | None |
| SDK `WorkspaceSnapshot` | Additive type | None |

## Phase 1 — Frontend Consistency (Complete)

| Item | Action | Status |
|------|--------|--------|
| Unify API scoping | Route hooks through `useApiClient()` with tenant + business headers | Done |
| Consolidate business profile hooks | Single `useActiveBusiness()` query key | Done |
| Product-gated navigation | `ProductGuard` + `useProductNavigation` | Done |
| Remove orphan pages | `business/BusinessPage.tsx`, unrouted `BusinessProfilePage.tsx` | Done |
| Customer 360 tabs | Tabbed detail view on customer page | Done |
| Business resolution middleware | `X-Business-ID` header → `request.current_business` | Done |

## Phase 2 — Platform Core Gaps (In Progress)

| Item | Action | Status |
|------|--------|--------|
| Branch entity | `branches` table + CRUD API under `/businesses/{id}/branches` | Done |
| Dashboard preferences | `BusinessSettings.dashboard_preferences` + frontend sync | Done |
| Business context fallback | `resolve_business_id()` for list/search without `?business=` | Done |
| Global search | `GET /api/v1/search` wired in app header + dashboard | Done |
| Branches UI | Settings → Business Profile branches panel | Done |
| Custom fields | `custom_field_definitions` + `custom_field_values` | Deferred |
| Unified audit | Activate `audit` app with event table | Deferred |

## Phase 3 — Application Extraction (Per Product)

When InvoiceIE ships:

1. New Django app `invoicing` with operational tables only
2. FK/reference `customer_id`, `service_id`, `business_id` — no Customer duplicate
3. New frontend feature folder `features/invoicing/`
4. Product-gated navigation via `platform.ts`

## Phase 4 — Platform Engines (Documented, Not Implemented)

Per IE-0004A — require separate milestones:

- Event Bus
- Workflow Engine
- Reporting Engine
- Search Engine
- Analytics aggregates

## Breaking Changes (Documented, NOT Implemented)

| Change | Reason Deferred |
|--------|-----------------|
| Merge `authentication.Role` + `staff.BusinessRole` | Security regression risk |
| Rename `Tenant` → `Workspace` in database | Massive API/SDK break |
| Convert booking UUID refs to Django FKs | Cross-app migration complexity |
| Move `customers` into `platform_core` Django app | Table rename risk |

## Rollback Strategy

Phase 0 changes are documentation + UI copy + additive types. Rollback = revert frontend labels and remove registry files. No database rollback required.
