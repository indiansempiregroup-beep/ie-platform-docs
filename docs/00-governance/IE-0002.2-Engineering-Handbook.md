# <a id="_yz3ff13q2m5h"></a>__IE\-0002 Engineering Handbook__

## <a id="_rc1859809nuw"></a>__Part 2 — Engineering Standards__

__Document Version:__ 1\.0

# <a id="_lit4ar43n3n9"></a>__12\. Repository Strategy__

The company follows a platform\-first architecture\.

Products are developed as independent modules while sharing IE Foundation\.

The documentation repository remains the single source of truth\.

Recommended repositories:

ie\-platform\-docs

ie\-foundation

appointie

invoiceie

inventoryie

crmie

marketie

design\-system

devops

Every repository must contain:

- README
- CHANGELOG
- LICENSE
- CONTRIBUTING
- CODEOWNERS
- docs
- tests

# <a id="_rbc6xnn77h5y"></a>__13\. Folder Structure Standards__

## <a id="_rw2rg2kerwn1"></a>__Backend__

backend/

core/

accounts/

business/

branding/

notifications/

files/

common/

appointie/

bookings/

services/

availability/

customers/

reviews/

analytics/

tests/

config/

requirements/

scripts/

Every Django application follows exactly the same structure\.

app/

models/

serializers/

views/

services/

selectors/

permissions/

validators/

signals/

tasks/

urls/

tests/

Business logic must live inside the __services__ layer\.

Views should remain thin\.

# <a id="_tctoenp07ez5"></a>__14\. Mobile Folder Structure__

mobile/

src/

api/

components/

screens/

navigation/

hooks/

store/

theme/

assets/

types/

utils/

constants/

Never place API calls directly inside screens\.

# <a id="_1ng018qglt4g"></a>__15\. Web Folder Structure__

dashboard/

src/

components/

pages/

layouts/

hooks/

services/

types/

store/

theme/

utils/

Pages should only orchestrate components\.

# <a id="_tdp7ndcowv28"></a>__16\. Naming Conventions__

Python

snake\_case

Classes

PascalCase

React Components

PascalCase

Variables

camelCase

Constants

UPPER\_CASE

Database Tables

snake\_case

Database Columns

snake\_case

API Endpoints

kebab\-case

Examples

/api/v1/bookings

/api/v1/business\-settings

/api/v1/customer\-profile

# <a id="_kzl8rcnf1gta"></a>__17\. Database Standards__

Every table must include

id \(UUID\)

created\_at

updated\_at

created\_by

updated\_by

Optional

deleted\_at

deleted\_by

is\_active

Soft delete is preferred whenever business records should be recoverable\.

Hard delete is reserved for exceptional cases\.

# <a id="_uldh8bdejj35"></a>__18\. UUID Policy__

Every primary key uses UUID\.

Never expose internal sequential IDs\.

Benefits

- Better security
- Easier synchronization
- Safer APIs
- Future distributed systems

# <a id="_45zxzhqvu5s"></a>__19\. Timestamp Standards__

Always store timestamps in UTC\.

Display times using the business timezone\.

Never store local times in the database\.

# <a id="_8vty4gpkg07l"></a>__20\. API Standards__

Every API must follow REST principles\.

Example

GET

POST

PUT

PATCH

DELETE

Base URL

/api/v1/

Future versions

/api/v2/

Breaking changes require a new API version\.

# <a id="_afgdkb968l4t"></a>__21\. API Response Format__

Success

\{

    "success": true,

    "message": "",

    "data": \{\}

\}

Validation Error

\{

    "success": false,

    "message": "Validation failed",

    "errors": \{\}

\}

Unexpected Error

\{

    "success": false,

    "message": "Internal server error"

\}

Every API response must follow the same structure\.

# <a id="_b11uvce5x0x2"></a>__22\. Validation Standards__

Validation belongs in multiple layers\.

Frontend

↓

API

↓

Service Layer

↓

Database Constraints

Never trust client\-side validation alone\.

# <a id="_uj2s5wrwq48e"></a>__23\. Service Layer Rules__

Views

↓

Services

↓

Models

Views never contain business logic\.

Models should not become "fat\."

Services own business rules\.

# <a id="_q2exvqi29as8"></a>__24\. Permission Standards__

Authorization is role\-based\.

Roles

- Platform Owner
- Business Owner
- Staff
- Customer

Permissions should be granular\.

Example

booking\.create

booking\.read

booking\.update

booking\.delete

Avoid broad permissions like "Admin"\.

# <a id="_t54tajwxpqgu"></a>__25\. Event Standards__

Instead of modules talking directly to each other\.\.\.

Everything publishes events\.

Example

Booking Confirmed

↓

Notification Engine

↓

Push Notification

↓

Analytics

↓

Google Calendar

↓

Audit Log

This reduces coupling\.

# <a id="_bgdru5jxxwm7"></a>__26\. Background Jobs__

Background workers handle:

- Notifications
- Email
- Reports
- Analytics
- Calendar Sync
- Scheduled Jobs
- AI Processing

Long\-running work should never block API responses\.

# <a id="_dqdbkvdo1ilp"></a>__27\. Caching Policy__

Cache only when necessary\.

Suitable candidates include:

- Dashboard statistics
- Business settings
- Public services
- Reports

Avoid caching user\-specific permissions unless properly invalidated\.

# <a id="_e4ubcvbd4t6w"></a>__28\. File Storage__

Files include:

- Logos
- Images
- Documents
- Reports
- Invoices

Never store uploaded files inside the application source code\.

Use abstracted storage so providers can change later\.

# <a id="_xp6zlvaevnqt"></a>__29\. Configuration__

Never hardcode:

Passwords

Secrets

API Keys

URLs

Certificates

Use environment variables\.

# <a id="_r3s2zh2pjzv5"></a>__30\. Secrets Management__

Secrets must never appear in:

Git

Documentation

Logs

Source code

Screenshots

Development environments should use sample values only\.

# <a id="_5fdduomrtvuv"></a>__31\. Logging Standards__

Levels

DEBUG

INFO

WARNING

ERROR

CRITICAL

Every error should include enough context for diagnosis without exposing sensitive data\.

# <a id="_69mzzm742c64"></a>__32\. Monitoring__

Monitor:

API Response Time

CPU

Memory

Database

Queue

Errors

Notification Delivery

Calendar Sync

Storage

Monitoring is proactive, not reactive\.

# <a id="_u1g5eli0w5no"></a>__33\. Performance Standards__

API target

< 500 ms for typical requests\.

Dashboard

< 2 seconds\.

Mobile startup

< 3 seconds\.

Heavy processing belongs in background jobs\.

# <a id="_y3umlzvir70r"></a>__34\. Git Workflow__

Branches

main

develop

feature/\*

bugfix/\*

hotfix/\*

No direct commits to main\.

All production changes require review\.

# <a id="_h9z9ajzckr3k"></a>__35\. Commit Messages__

Preferred format

feat:

fix:

docs:

refactor:

test:

build:

ci:

Example

feat\(bookings\): add appointment confirmation workflow

# <a id="_tzq9mda8epqk"></a>__36\. Pull Requests__

Every PR must include

Description

Related issue

Testing notes

Screenshots \(if UI\)

Checklist

No PR is merged without review\.

# <a id="_huzro6bodyry"></a>__37\. Code Reviews__

Reviewers verify

Architecture

Readability

Security

Performance

Testing

Documentation

Business rules

Consistency

Reviews improve code—they are not personal criticism\.

# <a id="_ulgcy8wlge0h"></a>__38\. Release Process__

Every release follows

Development

↓

QA

↓

UAT

↓

Release Candidate

↓

Production

↓

Monitoring

↓

Retrospective

No release skips QA except emergency hotfixes\.

# <a id="_76fuozy1ipza"></a>__39\. Documentation Standards__

Every feature requires updates to:

Architecture

API

Database

User Guide

Release Notes

Engineering Handbook

Documentation is treated as code\.

# <a id="_vsdsplm3h5kz"></a>__40\. AI Development Standards__

AI tools may generate code\.

AI tools may not define architecture\.

Every AI\-generated change must be reviewed for:

Correctness

Security

Performance

Maintainability

Consistency

Architecture compliance

AI is an accelerator—not the decision maker\.

# <a id="_eyll6uas8bvg"></a>__41\. Engineering Culture__

Engineers are expected to:

Ask questions\.

Document decisions\.

Share knowledge\.

Improve existing code\.

Leave systems better than they found them\.

Success is measured by long\-term maintainability, not by the number of lines of code written\.

