---
document_id: IE-1501
title: Platform Core Architecture
version: 1.0.0
status: Active
owner: Architecture Review Board
review_date: 2026-07-07
last_updated: 2026-07-07
related_documents:
  - IE-0004A
  - IE-0006
  - ADR-001
  - ADR-002
  - ADR-003
---

# Platform Core Architecture

## Vision

```
IE Platform
  └── Tenant (internal isolation)
        └── Subscription (platform + per-business product)
              └── Licensed Products
                    └── Businesses
                          └── Branches (future)
                                └── Platform Core (master data)
                                      └── Applications (operational data)
```

## Platform Core — Master Data Ownership

| Entity | Owner | Django App | API Prefix | Shared Across Products |
|--------|-------|------------|------------|------------------------|
| Tenant | Foundation | `tenancy` | `/tenants`, `/tenant/settings` | Yes (internal) |
| Organization | Foundation | `tenancy` | `/organizations/me` | Yes |
| Business | Platform Core | `businesses` | `/businesses` | Yes |
| Branch | Platform Core | — (future) | — | Yes |
| Customer | Platform Core | `customers` | `/customers` | **Yes** |
| Staff | Platform Core | `staff` | `/staff` | **Yes** |
| Service | Platform Core | `services` | `/services` | **Yes** |
| User / IAM | Foundation | `authentication` | `/auth` | Yes |
| Media | Platform Core | `platform_media` | `/media` | Yes |
| Notifications | Platform Core | `notifications` | `/notifications` | Yes |
| Localization | Platform Core | `businesses`, `tenancy` | PATCH business/tenant | Yes |

## Application Domains — Operational Data Only

### AppointIE (implemented)

| Entity | Django App | References Platform Core |
|--------|------------|--------------------------|
| Booking | `bookings` | `customer_id`, `staff_id`, `service_id` (UUID refs) |
| Availability / Schedules | `bookings` | `business`, `staff_id` |
| Calendar Integration | `calendar` | `business` |

### InvoiceIE, CRMIE, InventoryIE, HRIE (catalog only)

Product codes exist in `businesses.constants` and `BusinessProductSubscription`. No operational tables yet.

## Workspace Concept

See [ADR-002](ADR-002-Workspace-Abstraction.md).

```
Workspace = Product + Business
```

Implementation:

- Frontend: `WorkspaceContext`, `workspaceModel.ts`, `WorkspaceSnapshot` (SDK)
- Backend: unchanged — `X-Tenant-ID` + business scoping on queries

## Customer 360 Model (target)

```
Customer (Platform Core)
  ├── Overview (core profile)
  ├── Appointments (AppointIE module)
  ├── Invoices / Payments (InvoiceIE module)
  ├── Campaigns / Loyalty (CRMIE module)
  ├── Documents (Media)
  ├── Notes (Platform Core)
  └── Activity Timeline (aggregated, future event bus)
```

## Service Reuse Model

One `services.Service` record is referenced by:

- AppointIE bookings (`service_id`)
- InvoiceIE line items (future)
- CRMIE campaigns (future)

Never duplicate service definitions per product.

## Business Configuration

Business-level (not product-specific):

- Branding, working hours, localization
- Currency, timezone, language
- Product subscriptions (`BusinessProductSubscription`)

## Code Registries

| Location | Purpose |
|----------|---------|
| `backend/apps/platform_core/registry.py` | Backend domain → Django app mapping |
| `web/src/config/platform.ts` | Frontend domain registry |
| `packages/sdk/src/index.ts` | `WorkspaceSnapshot` type |

## What Was NOT Changed (Compatibility)

- No Django app moves or renames
- No API path changes
- No database migration changes
- No model field renames
- Tenant middleware unchanged
