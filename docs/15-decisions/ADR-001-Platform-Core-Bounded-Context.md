---
document_id: ADR-001
title: Platform Core Bounded Context
version: 1.0.0
status: Accepted
owner: Architecture Review Board
review_date: 2026-07-07
last_updated: 2026-07-07
related_documents:
  - IE-0004A
  - IE-0006
  - IE-1501
---

# ADR-001: Platform Core Bounded Context

## Status

**Accepted** — 2026-07-07

## Context

The IE Platform is evolving from a single-product application (AppointIE) into a multi-product enterprise SaaS ecosystem (InvoiceIE, CRMIE, InventoryIE, HRIE, and future products).

Today, shared master data (customers, staff, services, businesses) already lives in dedicated Django apps scoped by `tenant` + `business`. Product-specific operational data (bookings, calendar) lives in separate apps. There is no formal **Platform Core** package, but the data ownership model largely aligns with the target architecture.

A full rewrite or app consolidation would break API compatibility, existing migrations, and the production SDK contract.

## Decision

Introduce **Platform Core** as a **logical bounded context** documented and registered in code (`backend/apps/platform_core/registry.py`, `web/src/config/platform.ts`) without moving Django apps or renaming database tables in this milestone.

**Platform Core owns:**

- Business, Customer, Staff, Service Catalog
- Users, Roles, Permissions (foundation / IAM)
- Media, Notification Preferences
- Localization (currency, timezone, language) on business/tenant records

**Application domains own operational data only** and reference Platform Core entities by ID.

**Tenant** remains an internal isolation boundary (middleware, `X-Tenant-ID`). It is **not** a user-facing concept.

## Rationale

- Existing apps (`customers`, `staff`, `services`, `businesses`) already implement Platform Core responsibilities.
- Incremental evolution preserves backward compatibility.
- Formal registry enables future feature guards, documentation, and tooling without schema changes.

## Consequences

**Positive**

- Clear ownership model for new products.
- No breaking API or migration changes.
- Aligns implementation with IE-0004A and IE-0006 intent.

**Negative**

- Platform Core is not yet a single Django app or Python package with unified imports.
- Some concerns (audit, branches, unified tags) remain future work.

## Follow-up Actions

- Add `Branch` entity under Platform Core when multi-location is prioritized (ADR required).
- Consolidate duplicate API layers on the frontend (dashboard vs management scoping).
- Evaluate unified `audit` app when event bus is introduced.
