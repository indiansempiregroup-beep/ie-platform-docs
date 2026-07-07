# <a id="_wbjjm3htd0ea"></a>__IE\-0006 – Database Architecture Blueprint__

__Document ID:__ IE\-0006

__Document Name:__ Database Architecture Blueprint

__Platform:__ IE Platform

__Version:__ 1\.0

__Status:__ Architecture Baseline

__Classification:__ Internal

__Owner:__ Indians Empire Technologies

# <a id="_pvni5mbib17b"></a>__Table of Contents__

1. Purpose
2. Database Philosophy
3. Database Architecture
4. Domain Model
5. Multi\-Tenant Strategy
6. Base Entity Standard
7. Database Domains
8. Relationship Standards
9. Naming Standards
10. UUID Strategy
11. Soft Delete Policy
12. Audit Strategy
13. Versioning Strategy
14. Indexing Strategy
15. Performance Strategy
16. Backup & Recovery
17. Future Expansion

# <a id="_youhfa8e6b18"></a>__1\. Purpose__

The Database Architecture Blueprint defines the canonical data architecture for the IE Platform\.

Every database object used by AppointIE and future products must follow this blueprint\.

This document takes precedence over framework\-specific implementations\.

Django models, migrations, and repositories must be derived from this architecture\.

# <a id="_9x3fg9xbi7k2"></a>__2\. Database Philosophy__

The IE Platform database is designed using the following principles:

- Multi\-tenant by design
- Domain\-driven organization
- UUID primary keys
- Auditability
- Soft deletion
- Extensibility
- Configuration over hardcoding
- Backward\-compatible evolution

The database should remain stable as new products are added\.

# <a id="_hlgck1wo0bgj"></a>__3\. High\-Level Architecture__

IE Platform Database

│

├── Authentication Domain

├── Tenant Domain

├── Business Domain

├── Customer Domain

├── Staff Domain

├── Service Domain

├── Booking Domain

├── Notification Domain

├── Workflow Domain

├── Analytics Domain

├── Audit Domain

├── AI Domain

└── Platform Domain

Each domain owns its entities and business rules\.

# <a id="_glifk31nk6tc"></a>__4\. Database Domains__

## <a id="_85ji5ial2w5g"></a>__Authentication Domain__

Purpose

Identity and access management\.

Tables

- users
- user\_sessions
- refresh\_tokens
- roles
- permissions
- role\_permissions
- user\_roles

## <a id="_c75x5thoz10r"></a>__Tenant Domain__

Purpose

Multi\-tenancy\.

Tables

- tenants
- organizations
- tenant\_settings
- subscriptions
- subscription\_plans
- branding

**Implementation note (2026-07-07):** Each tenant has a 1:1 `organizations` record. Platform-level `subscriptions` attach to the tenant. Per-business product licensing uses `business_product_subscriptions` (see Business Domain).

Every business belongs to exactly one tenant via `organization`.

## <a id="_kuyne0aipl8c"></a>__Business Domain__

Purpose

Business information\.

Tables

- businesses
- business\_profiles
- business\_settings
- business\_media
- business\_product\_subscriptions
- business\_hours
- holidays
- branches \(future\)
- tax\_settings
- currencies

**business\_product\_subscriptions** links a business to licensed products (`appointie`, `invoiceie`, `crmie`) with plan, billing interval, and trial/period dates. References `subscription_plans`.

## <a id="_py28cbh7fbv3"></a>__Customer Domain__

Purpose

Customer management\.

Tables

- customers
- customer\_addresses
- customer\_notes
- customer\_preferences
- customer\_devices
- customer\_reviews

## <a id="_r3u5t9qwkyc5"></a>__Staff Domain__

Purpose

Staff management\.

Tables

- staff
- staff\_services
- staff\_availability
- staff\_leave
- staff\_roles

## <a id="_qs6agrimstl2"></a>__Service Domain__

Purpose

Service catalogue\.

Tables

- service\_categories
- services
- service\_prices
- service\_images
- service\_duration
- service\_tags

## <a id="_7rmf8io8ea0"></a>__Booking Domain__

Purpose

Appointment management\.

Tables

- bookings
- booking\_services
- booking\_history
- booking\_notes
- booking\_status\_history

## <a id="_2eiykbt9cd8n"></a>__Workflow Domain__

Purpose

Workflow engine\.

Tables

- workflows
- workflow\_status
- workflow\_transition

No booking status is hardcoded\.

## <a id="_sx75pnb1q3b2"></a>__Notification Domain__

Purpose

Communication\.

Tables

- notifications
- notification\_templates
- notification\_preferences
- notification\_delivery

## <a id="_y4oh21x244x"></a>__Analytics Domain__

Purpose

Reporting\.

Tables

- daily\_business\_summary
- daily\_staff\_summary
- daily\_service\_summary

Analytics data should be aggregated rather than recalculated repeatedly\.

## <a id="_epa0cues7n1d"></a>__Audit Domain__

Purpose

Compliance\.

Tables

- audit\_logs
- audit\_events

Audit entries are immutable\.

## <a id="_5lc8ub9mkg2g"></a>__AI Domain__

Purpose

Future AI capabilities\.

Tables

- ai\_prompts
- ai\_recommendations
- ai\_forecasts
- ai\_feedback

## <a id="_ucvt2bqn3035"></a>__Platform Domain__

Purpose

Shared platform configuration\.

Tables

- countries
- states
- cities
- languages
- currencies
- settings

# <a id="_szd7sd91p259"></a>__5\. Multi\-Tenant Strategy__

Every business record includes a Tenant reference\.

Example:

Tenant

↓

Business

↓

Customers

↓

Bookings

↓

Reviews

↓

Analytics

Data from different tenants must never mix\.

Every API request resolves the tenant context before executing business logic\.

# <a id="_fk5yco1zlw6t"></a>__6\. Canonical Base Entity__

Every business table inherits the following fields:

__Field__

__Type__

__Purpose__

id

UUID

Primary key

tenant\_id

UUID

Tenant ownership

created\_at

Timestamp

Creation date

updated\_at

Timestamp

Last update

created\_by

UUID

Creator

updated\_by

UUID

Last editor

deleted\_at

Timestamp

Soft delete timestamp

deleted\_by

UUID

User performing delete

is\_active

Boolean

Active flag

version

Integer

Optimistic locking

This standard ensures consistency across the platform\.

# <a id="_ktwpu81360ki"></a>__7\. Relationship Standards__

Relationship types:

One\-to\-One

One\-to\-Many

Many\-to\-Many

All relationships use foreign keys with UUID references\.

Cascade delete is avoided for business\-critical data\.

Soft deletion is preferred\.

# <a id="_otfd91qfhply"></a>__8\. Naming Standards__

Tables

snake\_case

Columns

snake\_case

Indexes

idx\_\_

Foreign Keys

fk\_\_

Unique Constraints

uq\_\_

Examples:

idx\_bookings\_customer\_id

fk\_bookings\_staff

uq\_users\_email

# <a id="_3sd1pjqu547l"></a>__9\. UUID Strategy__

All primary keys use UUID Version 7 when supported by the platform\.

Benefits:

- Better insertion performance than random UUIDs
- Improved scalability
- Easier distributed systems support
- Reduced predictability compared to sequential IDs

Public APIs expose UUIDs only\.

# <a id="_zybjxpfxf24"></a>__10\. Soft Delete Policy__

Business entities should not be permanently deleted\.

Deletion updates:

deleted\_at

deleted\_by

is\_active

Permanent deletion is reserved for platform maintenance under controlled procedures\.

# <a id="_7uvcgfmxcqds"></a>__11\. Audit Strategy__

Critical operations generate audit records\.

Examples:

Customer created

Booking confirmed

Business hours changed

Service archived

Permission modified

Audit logs include:

Timestamp

User

Tenant

Action

Resource

Previous value \(where appropriate\)

New value \(where appropriate\)

# <a id="_5ej7vmjjsv31"></a>__12\. Versioning Strategy__

Every mutable entity includes a version field\.

The version increments on each successful update\.

Applications should detect concurrent modifications and respond gracefully\.

# <a id="_rv7ly35sfvm"></a>__13\. Indexing Strategy__

Index the following categories:

- Foreign keys
- Frequently searched columns
- Booking dates
- Customer contact fields
- Service names
- Staff availability
- Notification status

Composite indexes should support common search patterns\.

Indexes should be reviewed as query patterns evolve\.

# <a id="_c7kitqo9ucu5"></a>__14\. Performance Strategy__

Performance principles:

- Avoid unnecessary joins\.
- Prefer pagination for large datasets\.
- Aggregate analytics data\.
- Cache configuration where appropriate\.
- Use background processing for heavy operations\.

Database performance should be monitored continuously\.

# <a id="_1n8jwfdxw8o8"></a>__15\. Event Store__

Platform events are persisted\.

Tables:

- event\_store
- event\_subscriptions
- event\_delivery

Events support:

- Retry
- Replay
- Audit
- Debugging

The Event Store is the authoritative record of platform events\.

# <a id="_6ibtlo6c7bsg"></a>__16\. Configuration Tables__

Avoid hardcoded values\.

Examples:

- Workflow statuses
- Notification templates
- Languages
- Time zones
- Business categories
- Service categories

Configuration should be data\-driven\.

# <a id="_2u51x8upfrhy"></a>__17\. Backup & Recovery__

Production databases require:

- Automated encrypted backups
- Point\-in\-time recovery where supported
- Regular restoration testing
- Documented recovery procedures

Recovery objectives should be defined by operational requirements\.

# <a id="_ktmli84sedok"></a>__18\. Data Retention__

Retention policies should define:

- Audit log duration
- Notification history
- AI interaction history
- Analytics aggregation periods

Deletion policies must comply with applicable privacy regulations\.

# <a id="_dblbbjoi9ow1"></a>__19\. Future Expansion__

The database architecture anticipates future modules including:

- InvoiceIE
- InventoryIE
- CRMIE
- MarketIE
- InsightIE

New modules should extend existing domains where appropriate rather than duplicating data\.

# <a id="_wdtle7bg6qzs"></a>__20\. Architectural Principles__

The database must remain:

- Stable
- Predictable
- Extensible
- Tenant\-aware
- Secure
- Auditable
- Performant

Schema evolution should preserve backward compatibility whenever practical\.

# <a id="_swzn75k90k9p"></a>__Closing Statement__

The IE Platform Database Architecture establishes the canonical data model for Indians Empire Technologies\.

It is intentionally independent of any specific framework, ensuring that the underlying business model remains consistent even if implementation technologies evolve\.

All database changes, Django models, migrations, APIs, and reporting structures must align with this blueprint\. Architectural exceptions require review through the Engineering Decision Record \(EDR\) process\.

