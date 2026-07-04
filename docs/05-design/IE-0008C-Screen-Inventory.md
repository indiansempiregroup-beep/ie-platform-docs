---
document_id: IE-0008C
title: Screen Inventory
version: 1.0
status: Active
owner: Design Systems
review_date: 2026-07-04
last_updated: 2026-07-04
related_documents:
  - IE-0008
  - IE-0008B
  - IE-0008A
---

# Screen Inventory

## Revision History

| Version | Date | Author | Summary |
| --- | --- | --- | --- |
| 1.0 | 2026-07-04 | Design Systems Group | Initial screen inventory for the IE Platform product experience |

## Table of Contents

1. Purpose
2. Inventory Principles
3. Customer Experience Screens
4. Business Experience Screens
5. Admin Experience Screens
6. Shared Utility Screens
7. Screen Priority Matrix

## 1. Purpose

This document inventories the core screens required to support the IE Platform experience before visual design implementation begins. It ensures that the design system and user flows cover the complete surface area of the platform across customers, business operators, analysts, and administrators.

## 2. Inventory Principles

Each screen should support one primary objective and one or more clear user actions. Screens are grouped by audience and then by workflow domain.

## 3. Customer Experience Screens

### Authentication

- Welcome Screen
- Sign In
- Sign Up
- Forgot Password
- OTP Verification
- Password Reset Confirmation

### Onboarding

- Profile Setup
- Preferences Setup
- Service Interest Selection
- Notification Preferences

### Booking and Services

- Home / Discover
- Service Listing
- Service Detail
- Provider Detail
- Availability Calendar
- Booking Form
- Review Booking
- Booking Confirmation
- Upcoming Appointments
- Appointment Detail
- Reschedule Appointment
- Cancel Appointment

### Account and Settings

- Profile Overview
- Account Settings
- Notification Settings
- Accessibility Settings
- Theme Settings

## 4. Business Experience Screens

### Dashboard and Operations

- Business Dashboard
- Daily Overview
- Booking Queue
- Pending Confirmations
- Alerts and Issues

### Customer and Appointment Management

- Customer Directory
- Customer Detail
- Appointment Detail
- Appointment Management
- Follow-Up Queue

### Services and Staff

- Service Library
- Service Detail
- Staff Directory
- Staff Detail
- Availability Management
- Schedule Planner

### Reporting and Insights

- Business Reports
- Booking Summary
- Revenue Overview
- Attendance Report
- Performance Snapshot

### Business Settings

- Business Profile
- Notification Rules
- Team Permissions
- Integration Settings

## 5. Admin Experience Screens

### Platform Administration

- Admin Dashboard
- Platform Overview
- Tenant Management
- User Management
- Role Management
- Permission Matrix
- Audit Log
- Security Events

### Configuration and Support

- Feature Flag Management
- Integration Console
- Support Desk
- Incident Overview
- System Health

## 6. Shared Utility Screens

- Notifications Center
- Search Results
- Empty State View
- Error State View
- Loading State View
- Settings Landing
- Help and Support
- Terms and Privacy

## 7. Screen Priority Matrix

| Screen Group | Priority | Notes |
| --- | --- | --- |
| Authentication | High | Required for all user journeys |
| Booking and service management | High | Core customer journey |
| Business dashboard | High | Core operator workflow |
| Reports and analytics | High | Required for BI use cases |
| Platform admin surfaces | High | Required for operations and support |
| Settings and preferences | Medium | Important for retention and control |
| Support and help | Medium | Needed for onboarding and issue resolution |

## Related Documents

- [Navigation and User Flow Specification](IE-0008B-Navigation-and-User-Flow-Specification.md)
- [Design System Specification](IE-0008A-Design-System-Specification.md)
- [UI/UX Architecture Blueprint](IE-0008-UI-UX-Architecture-Blueprint.md)
