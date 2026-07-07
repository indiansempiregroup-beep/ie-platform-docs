---
document_id: ADR-003
title: Customer Ownership Belongs to Business
version: 1.0.0
status: Accepted
owner: Architecture Review Board
review_date: 2026-07-07
last_updated: 2026-07-07
related_documents:
  - ADR-001
  - IE-0006
---

# ADR-003: Customer Ownership Belongs to Business (Not Product)

## Status

**Accepted** — 2026-07-07

## Context

In a multi-product platform, customers must be shared across AppointIE, InvoiceIE, and CRMIE. Duplicating customer records per product would cause data inconsistency and integration failures.

The current `customers.Customer` model is scoped to `tenant` + `business` — not to a product code. Bookings reference `customer_id` as a UUID without a product-specific customer table.

## Decision

**Customers belong to the Business (Platform Core).** Applications consume customers by reference ID only.

**Customer 360 profile** (future UI) will compose modules from each application:

| Tab | Owner |
|-----|-------|
| Overview | Platform Core |
| Appointments | AppointIE |
| Invoices / Payments | InvoiceIE |
| Campaigns / Loyalty | CRMIE |
| Documents / Notes | Platform Core |

No product may create a parallel customer master table.

## Rationale

- Already implemented in schema (`customers` app).
- Matches DDD aggregate root pattern for Customer under Business.
- Enables cross-product customer timeline without sync jobs.

## Consequences

**Positive**

- Single source of truth for CRM, billing, and scheduling.
- SDK `Customer` type is product-agnostic.

**Negative**

- Product-specific customer extensions must use JSON fields, custom fields (future), or related tables keyed by `customer_id` — not duplicate Customer rows.

## Follow-up Actions

- Implement unified Customer 360 page (composition UI).
- Add `custom_fields` Platform Core capability (see migration roadmap).
- Ensure all frontend hooks scope customer queries by active `businessId`.
