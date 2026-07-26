---
document_id: IE-0070
title: ShopIE Product Requirements Document
version: 0.1.0
status: Draft
owner: Product Management
last_updated: 2026-07-26
---

# ShopIE PRD

## Vision

Give any retail-style business on IE Platform a modern commerce stack: sell products, manage stock, bill customers, and optionally take white-label mobile orders—without a separate inventory or invoice product SKU.

## Goals

1. Domain-agnostic core (grocery, salon retail, pharmacy, pet, electronics, …)
2. Multi-barcode per product; camera-first scan; online prefill on add
3. Fast POS basket checkout (DB lookup only)
4. Unified OPS with AppointIE via subscription union (no product switcher)
5. Billing module includes invoices, returns, and proforma quotations

## Non-goals (v1)

- Separate InvoiceIE / InventoryIE products
- Full warehouse ERP / multi-warehouse
- RFID bulk scan (stretch)
- Marketplace

## Pilot appendix

Nashik pet retail + grooming validates ShopIE + AppointIE together; Pets pack is optional and not core.
