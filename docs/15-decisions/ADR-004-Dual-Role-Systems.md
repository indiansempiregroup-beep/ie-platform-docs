---
document_id: ADR-004
title: Retain Dual Role Systems During Migration
version: 1.0.0
status: Accepted
owner: Architecture Review Board
review_date: 2026-07-07
last_updated: 2026-07-07
related_documents:
  - ADR-001
---

# ADR-004: Retain Dual Role Systems During Migration

## Status

**Accepted** — 2026-07-07

## Context

The platform has two independent authorization models:

1. **Platform IAM** — `authentication.Role`, `Permission`, `UserRole` (global user permissions)
2. **Business operations** — `staff.BusinessRole`, `StaffRoleAssignment` (per-staff business roles with JSON permissions)

Merging these immediately would require API changes, migration of permission checks, and frontend guard rewiring.

## Decision

**Retain both role systems** until a unified authorization service is designed and migrated behind feature flags.

Document the distinction:

| System | Scope | Used for |
|--------|-------|----------|
| Platform IAM | User (global) | API access, admin, cross-tenant operations |
| Business roles | Staff member | Operational permissions within a business |

## Rationale

- Both systems are in production use.
- Breaking permission checks risks security regressions.
- Unification is a dedicated milestone, not an architectural evolution side-effect.

## Consequences

**Positive**

- No auth regression during platform evolution.
- Clear documentation for engineers.

**Negative**

- Cognitive overhead for developers.
- `FeatureGuard` / `RoleGuard` exist in frontend but are not fully wired.

## Follow-up Actions

- ADR for unified authorization model (future milestone).
- Wire frontend guards to platform IAM permissions incrementally.
