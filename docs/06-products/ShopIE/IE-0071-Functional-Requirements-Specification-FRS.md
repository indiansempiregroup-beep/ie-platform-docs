---
document_id: IE-0071
title: ShopIE Functional Requirements Specification
version: 0.1.0
status: Draft
owner: Product Management
last_updated: 2026-07-26
---

# ShopIE FRS

## Modules

| Module | Capabilities |
|--------|----------------|
| Commerce | Products, barcodes, POS basket, orders (pickup/POS/delivery) |
| Inventory | Stock on hand, adjustments, movements, low-stock |
| Billing | Invoice from order, quotations (proforma), returns (credit path) |
| Reminders | Generic replenishment rules (later wave) |

## Barcodes

- Types: `manufacturer`, `internal` (+ `rfid_epc` later)
- Many codes per product; unique per business
- Enrichment on add via Open Food Facts; never on POS scan

## APIs (initial)

- `GET/POST /api/v1/shop/products`
- `POST /api/v1/shop/barcodes/lookup`
- `POST /api/v1/shop/barcodes/enrich`
- `GET/POST /api/v1/shop/orders`
- `POST /api/v1/shop/orders/{id}/status`
- `GET/POST /api/v1/shop/quotations`
- Mobile: `/api/v1/mobile/shop/products`, `/mobile/shop/orders`

## Product code

`shopie` with plans `shopie-starter` / `shopie-pro`.
