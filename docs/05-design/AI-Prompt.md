---
document_id: AI-Prompt
title: AI Design Prompt
version: 1.0
status: Active
owner: Design Systems
review_date: 2026-07-04
last_updated: 2026-07-04
related_documents:
  - IE-0009.02
  - IE-0008.09
  - IE-0008.10
---

# AI Design Prompt

## Purpose

Use this single prompt in Figma AI, Lovable, Penpot, Builder.io, or any other AI-assisted design tool to generate production-ready UI concepts for the IE Platform and AppointIE.

## Copy-Paste Prompt

Create a production-ready UI design system and interface for the IE Platform, specifically for the first product AppointIE. Follow the existing IE Platform architecture, product requirements, functional requirements, design system, UX principles, information architecture, navigation architecture, component library, and screen inventory without redesigning the platform. Preserve all approved architectural decisions and create work that is enterprise-grade, polished, accessible, and suitable for real product implementation.

Generate the following experience surfaces:

- Customer mobile app experience for booking, discovery, account, notifications, profile, and settings
- Operations dashboard for business owners and staff managing bookings, calendar, customers, staff, services, reports, and settings
- Business intelligence dashboard for analytics, KPIs, forecasting, revenue trends, and reports
- Platform admin experience for tenants, subscriptions, branding, monitoring, audits, and platform settings
- Authentication flows including login, registration, OTP verification, and password reset
- Booking flows including service selection, staff selection, date and time selection, review, confirmation, and reschedule
- Calendar and scheduling experiences with availability states and event structure
- Reports and analytics screens with charts, tables, filters, and exports
- Notifications, profile, and settings experiences with clear states and actions

Design requirements:

- Use a mobile-first, web-ready, and responsive approach
- Follow a consistent design system with clear hierarchy, spacing, typography, color, iconography, borders, elevation, and motion
- Support light mode and dark mode
- Ensure WCAG 2.2 AA accessibility standards
- Use semantic components and clear states for loading, empty, error, success, offline, and disabled states
- Avoid visual clutter and prioritize clarity, trust, speed, and task completion
- Preserve white-label capability and allow brand customization through approved tokens and surfaces only
- Maintain consistency with the existing IE Platform architecture and AppointIE product goals
- Use professional, modern, calm, trustworthy, and highly usable visual language
- Favor subtle motion, clear feedback, and polished interaction design

Implementation guidance:

- Use shared design tokens and reusable components
- Keep layouts aligned to an 8-point spacing system
- Use a clear grid system for mobile, tablet, and desktop
- Use accessible labels, focus states, touch targets, and readable contrast
- Create polished states for forms, buttons, cards, tables, charts, dialogs, bottom sheets, badges, chips, toasts, loaders, and skeletons
- Ensure every generated screen can be implemented in Figma, Lovable, Penpot, Builder.io, or future design tools
- Make the output suitable for direct handoff to developers without requiring redesign

Output format:

Provide the full UI design package as structured sections:

1. Overview and design direction
2. Core design system and tokens
3. Screen-by-screen layout specifications
4. Component recommendations and variants
5. Interaction and microinteraction guidance
6. Accessibility and responsiveness guidance
7. States and empty/error/loading/offline behavior
8. Developer handoff notes

Make the output clean, enterprise-grade, and ready to be used as a production design specification.
