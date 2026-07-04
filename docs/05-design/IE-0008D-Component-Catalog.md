---
document_id: IE-0008D
title: Component Catalog
version: 1.0
status: Active
owner: Design Systems
review_date: 2026-07-04
last_updated: 2026-07-04
related_documents:
  - IE-0008
  - IE-0008A
  - IE-0003B
---

# Component Catalog

## Revision History

| Version | Date | Author | Summary |
| --- | --- | --- | --- |
| 1.0 | 2026-07-04 | Design Systems Group | Initial reusable UI component catalog for the IE Platform |

## Table of Contents

1. Purpose
2. Catalog Principles
3. Component Catalog
4. Component Documentation Template
5. Governance Notes

## 1. Purpose

This catalog defines the reusable UI components required to implement the IE Platform design system in production. It provides each component with purpose, properties, states, variants, accessibility guidance, usage rules, and examples so that designers and engineers build from the same specification.

## 2. Catalog Principles

Each component must be:

- Reusable across products
- Clear in its purpose
- Consistent in its API and behavior
- Accessible by default
- Theme-aware and responsive

## 3. Component Catalog

### 3.1 Button

**Purpose**
Provide a clear action trigger for user intent.

**Properties**
- variant
- size
- disabled
- loading
- icon

**States**
- default
- hover
- focus
- active
- disabled
- loading

**Variants**
- primary
- secondary
- ghost
- destructive

**Accessibility**
Screen-reader labels, visible focus state, keyboard activation.

**Usage**
Use for primary actions, confirmations, and navigation.

**Example**
Primary button: Continue
Secondary button: Cancel

### 3.2 Card

**Purpose**
Group related content into a contained, scannable surface.

**Properties**
- title
- subtitle
- action
- interactive
- elevation

**States**
- default
- hover
- selected
- disabled

**Variants**
- summary card
- service card
- booking card
- metric card

**Accessibility**
Use semantic headings and ensure interactive cards are keyboard-supportable.

**Usage**
Use for service discovery, summaries, dashboards, and schedules.

### 3.3 Input

**Purpose**
Capture and validate structured user input.

**Properties**
- label
- value
- errorText
- helperText
- required
- disabled

**States**
- default
- focused
- filled
- invalid
- disabled

**Variants**
- text
- textarea
- email
- password
- search
- date

**Accessibility**
Provide a visible label and clear error association.

**Usage**
Use in authentication, booking, profile, and admin forms.

### 3.4 List

**Purpose**
Display ordered or grouped information in a predictable format.

**Properties**
- items
- dense
- divider
- leadingIcon
- trailingAction

**States**
- default
- selected
- active
- disabled

**Variants**
- simple list
- settings list
- task list
- navigation list

**Accessibility**
Ensure readable order and actionable labels.

**Usage**
Use for settings, tasks, navigation, and summaries.

### 3.5 Modal

**Purpose**
Direct the user’s attention to a focused task or confirmation.

**Properties**
- title
- description
- primaryAction
- secondaryAction
- size

**States**
- open
- loading
- error
- confirmation

**Variants**
- confirmation
- form modal
- destructive action

**Accessibility**
Trap focus while open and provide keyboard dismiss support.

**Usage**
Use for confirmations, action completion, edits, and workflows that require explicit attention.

### 3.6 Table

**Purpose**
Present structured data and allow review and manipulation.

**Properties**
- columns
- rows
- sortable
- filterable
- pagination

**States**
- default
- loading
- empty
- selected

**Variants**
- simple table
- data table
- compact table

**Accessibility**
Use proper table semantics and clear column headers.

**Usage**
Use for reports, customers, bookings, and admin records.

### 3.7 Navigation Bar

**Purpose**
Enable movement between major product areas.

**Properties**
- items
- activeItem
- collapsed
- badge

**States**
- default
- hover
- active
- current

**Variants**
- side navigation
- top navigation
- bottom navigation
- tab navigation

**Accessibility**
Provide clear active state and keyboard support.

**Usage**
Use in application shells and module-level navigation.

### 3.8 Calendar

**Purpose**
Display dates and scheduling information.

**Properties**
- dateRange
- selectedDate
- eventMarkers
- viewMode

**States**
- default
- selected
- disabled
- today

**Variants**
- month calendar
- week calendar
- availability calendar

**Accessibility**
Keyboard navigation and screen-reader labeling are required.

**Usage**
Use for booking, service schedules, and availability planning.

### 3.9 Date Picker

**Purpose**
Allow users to choose dates and date ranges.

**Properties**
- value
- minDate
- maxDate
- range

**States**
- default
- focused
- invalid
- disabled

**Variants**
- single date
- date range

**Accessibility**
Provide both text input and calendar selection support.

**Usage**
Use in booking and profile forms.

### 3.10 Bottom Sheet

**Purpose**
Reveal contextual content or actions from the lower edge of the screen.

**Properties**
- title
- content
- actions
- snapPoints

**States**
- collapsed
- expanded
- loading

**Variants**
- action sheet
- filter sheet
- form sheet

**Accessibility**
Support keyboard dismissal and layered focus behavior.

**Usage**
Use for mobile actions and contextual workflows.

### 3.11 Badge

**Purpose**
Indicate status or category.

**Properties**
- label
- tone
- icon

**States**
- default
- active
- muted

**Variants**
- status badge
- category badge
- notification badge

**Accessibility**
Use clear labels and avoid color-only status meaning.

**Usage**
Use for status summaries, priorities, and notifications.

### 3.12 Chart

**Purpose**
Visualize metrics and trends.

**Properties**
- data
- type
- legend
- tooltip

**States**
- loading
- empty
- error
- interactive

**Variants**
- bar
- line
- area
- pie

**Accessibility**
Provide accessible summaries and descriptive legends.

**Usage**
Use in analytics, performance reporting, and dashboards.

### 3.13 Toast

**Purpose**
Briefly communicate status or confirmation.

**Properties**
- message
- type
- actionLabel
- duration

**States**
- visible
- dismissed

**Variants**
- success
- error
- warning
- info

**Accessibility**
Ensure the message is announced appropriately and not rely solely on motion.

**Usage**
Use for confirmation, errors, and short feedback.

### 3.14 Snackbar

**Purpose**
Provide lightweight feedback with optional action.

**Properties**
- message
- actionLabel
- duration

**States**
- visible
- dismissed

**Variants**
- retry
- confirmation
- warning

**Accessibility**
Use clear action label and sufficient contrast.

**Usage**
Use for recovery flows and transient notices.

### 3.15 Skeleton

**Purpose**
Placeholder content while data is loading.

**Properties**
- shape
- width
- height
- repeat

**States**
- loading
- complete

**Variants**
- text skeleton
- card skeleton
- table skeleton

**Accessibility**
Use only as a temporary visual placeholder and not as a substitute for real content.

**Usage**
Use during data fetches and async content loading.

### 3.16 Loading Indicator

**Purpose**
Signal work in progress.

**Properties**
- type
- label
- size
- overlay

**States**
- active
- complete
- error

**Variants**
- spinner
- inline loader
- progress bar

**Accessibility**
Provide status text where needed and avoid ambiguous motion-only feedback.

**Usage**
Use for submits, background processing, and content loading.

## 4. Component Documentation Template

Every component should follow this documentation pattern:

1. Purpose
2. Properties
3. States
4. Variants
5. Accessibility
6. Usage
7. Examples

## 5. Governance Notes

New components must be reviewed before broad adoption, documented in the shared catalog, and aligned with the design tokens and accessibility requirements established by the platform design system.

## Related Documents

- [UI/UX Architecture Blueprint](IE-0008-UI-UX-Architecture-Blueprint.md)
- [Design System Specification](IE-0008A-Design-System-Specification.md)
- [Navigation and User Flow Specification](IE-0008B-Navigation-and-User-Flow-Specification.md)
