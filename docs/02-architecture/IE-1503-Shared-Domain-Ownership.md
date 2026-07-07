---
document_id: IE-1503
title: Shared Domain Ownership Models
version: 1.0.0
status: Active
owner: Architecture Review Board
review_date: 2026-07-07
last_updated: 2026-07-07
related_documents:
  - IE-1501
  - ADR-003
---

# Shared Domain Ownership Models

## Business Ownership

**Owner:** Platform Core (`businesses` app)

Business is the primary commercial entity. Configuration is **not product-specific**:

- Branding (logo, colors — via `BusinessMedia`, tenant `Branding`)
- Working hours (`BusinessProfile`, `BusinessSettings`)
- Localization: currency, timezone, language
- Product subscriptions (`BusinessProductSubscription`)

**Hierarchy (implementation):**

```
Tenant (internal)
  └── Organization (1:1)
        └── Business (1:N)
              └── [Branch — future]
```

**Rule:** InvoiceIE, AppointIE, and CRMIE all read the same `Business` record.

## Customer Ownership

**Owner:** Platform Core (`customers` app)  
**Scope:** `tenant` + `business`

See [ADR-003](../15-decisions/ADR-003-Customer-Ownership.md).

- Customers do **not** belong to AppointIE or InvoiceIE.
- Applications store `customer_id` references only.
- Customer 360 UI composes product modules — no duplicate master records.

## Staff Ownership

**Owner:** Platform Core (`staff` app)  
**Scope:** `tenant` + `business`

- Optional link to `authentication.User`
- Business roles (`BusinessRole`, `StaffRoleAssignment`) are operational — separate from platform IAM (ADR-004)
- AppointIE bookings reference `staff_id`; InvoiceIE would reference same staff for sales attribution

**Rule:** Never duplicate Staff per product.

## Service Ownership

**Owner:** Platform Core (`services` app)  
**Scope:** `tenant` + `business`

```
Service "Hair Cut" (Platform Core)
  ├── Booking (AppointIE) — service_id
  ├── Invoice line item (InvoiceIE) — service_id [future]
  └── CRM campaign target (CRMIE) — service_id [future]
```

- Categories, variants, pricing, duration live in `services` app
- `staff.StaffServiceAssignment` links staff to services

**Rule:** One service catalog per business, shared across products.

## Media Ownership

**Owner:** Platform Core (`platform_media` app)

Referenced by customers, staff, services, bookings, and business gallery. Central deduplication via checksum.

## Notification Preferences

**Owner:** Platform Core (`notifications` app)

Templates and per-user/business preferences. Delivery is operational; preference storage is shared.

## What Applications Own

Applications own **transactions and workflows** only:

| Product | Owns | References |
|---------|------|------------|
| AppointIE | Bookings, availability, schedules | customer, staff, service, business |
| InvoiceIE | Invoices, payments, taxes | customer, staff, service, business |
| CRMIE | Campaigns, loyalty, automation | customer, staff, business |
