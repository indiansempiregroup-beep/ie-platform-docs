---
document_id: IE-0072
title: ShopIE Product Documentation Index
version: 0.1.0
status: Draft
owner: Product Management
last_updated: 2026-07-26
---

# ShopIE

Vertical-agnostic commerce product on IE Platform: catalog, multi-barcode POS, inventory, billing (invoices, returns, proforma), and customer white-label shop.

InvoiceIE and InventoryIE scopes are **modules inside ShopIE**, not separate sellable products.

## Documents

| ID | Document |
|----|----------|
| IE-0070 | [Product Requirements (PRD)](./IE-0070-ShopIE-Product-Requirements-Document-PRD.md) |
| IE-0071 | [Functional Requirements (FRS)](./IE-0071-Functional-Requirements-Specification-FRS.md) |

## Surfaces

- OPS web: `/shop/pos`, `/shop/products`, `/shop/orders`
- OPS mobile: Shop products / orders (More menu when subscribed)
- Customer mobile: Shop tab when `mobile_shop` feature is enabled

## Related

- AppointIE for bookable services (use together without product switching)
- Platform Core: business, customer, media, subscriptions
