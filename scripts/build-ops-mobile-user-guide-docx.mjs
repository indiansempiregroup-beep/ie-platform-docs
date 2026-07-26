/**
 * Build official IE-0005.04 OPS Mobile User Guide (.docx) with detailed how-it-works text.
 * Usage: node scripts/build-ops-mobile-user-guide-docx.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, '..');
const imagesDir = path.join(docsRoot, 'docs/06-products/AppointIE/images/ops-mobile');
const outPath = path.join(
  docsRoot,
  'docs/06-products/AppointIE/IE-0005.04-OPS-Mobile-App-User-Guide.docx',
);
const outPathAlt = path.join(
  docsRoot,
  'docs/06-products/AppointIE/IE-0005.04-OPS-Mobile-App-User-Guide-v1.1.docx',
);

const PAGE_WIDTH_DXA = 12240;
const MARGIN_DXA = 720;
const CONTENT_WIDTH_DXA = PAGE_WIDTH_DXA - MARGIN_DXA * 2;
const IMAGE_WIDTH_PX = 280;
const IMAGE_HEIGHT_PX = 606;

function loadImage(name) {
  const filePath = path.join(imagesDir, name);
  if (!fs.existsSync(filePath)) throw new Error(`Missing image: ${filePath}`);
  return { data: fs.readFileSync(filePath), ext: path.extname(name).toLowerCase() };
}

function p(text, options = {}) {
  return new Paragraph({
    spacing: { after: 140 },
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: options.size ?? 22,
        bold: options.bold,
        italics: options.italics,
        color: options.color,
      }),
    ],
  });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: 'Calibri', bold: true })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function figure(imageName, caption) {
  const { data, ext } = loadImage(imageName);
  const type = ext === '.jpeg' || ext === '.jpg' ? 'jpg' : 'png';
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 40 },
      children: [
        new ImageRun({
          type,
          data,
          transformation: { width: IMAGE_WIDTH_PX, height: IMAGE_HEIGHT_PX },
          altText: { title: caption, description: caption, name: imageName },
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({ text: caption, font: 'Calibri', size: 18, italics: true, color: '4B5563' }),
      ],
    }),
  ];
}

function simpleTable(headers, rows) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' };
  const borders = { top: border, bottom: border, left: border, right: border };
  const colW = Math.floor(CONTENT_WIDTH_DXA / headers.length);
  return new Table({
    width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: headers.map(
          (h) =>
            new TableCell({
              borders,
              width: { size: colW, type: WidthType.DXA },
              shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: h, bold: true, font: 'Calibri', size: 20 })],
                }),
              ],
            }),
        ),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  borders,
                  width: { size: colW, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: cell, font: 'Calibri', size: 20 })],
                    }),
                  ],
                }),
            ),
          }),
      ),
    ],
  });
}

const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

function howItWorksHeader() {
  return p('How it works', { bold: true, size: 22, color: '1D4ED8' });
}

async function main() {
  const children = [
    heading('IE-0005.04 — AppointIE OPS Mobile App User Guide'),
    p('Version 1.1.0 · Active · Updated 2026-07-26', { size: 20, color: '4B5563' }),
    p(
      'This guide explains how OPS Mobile works for day-to-day AppointIE operations — not only screen names, but what you see, what you can do, and what happens after each action. Screenshots are from the seeded Demo Salon workspace on iOS.',
    ),
    simpleTable(
      ['Item', 'Value'],
      [
        ['Audience', 'Business owners, managers, and staff'],
        ['App', 'OPS Mobile (apps/ops-mobile)'],
        ['Workspace', 'Demo Salon (demo / MAIN)'],
        ['Owner login', 'pilot-owner@ieplatform.local / PilotPass123!'],
      ],
    ),
    p(''),
    heading('Access rules (important)'),
    bullet('Business owner — full access including settings, billing, team, and BI.'),
    bullet('Manager — operations plus Settings, Team, staff directory, BI/Reports.'),
    bullet('Staff — bookings, calendar, and customers; Settings/Team/BI/staff directory are hidden.'),
    bullet(
      'Soft lock — if trial/period ended, viewing usually still works, but creating bookings/staff/offices may be blocked until renew/upgrade under Products & plans.',
    ),

    pageBreak(),
    heading('1. Overview — how the app is organized'),
    p(
      'After sign-in, OPS Mobile opens a five-tab shell. Use Home for the daily snapshot, Bookings/Calendar for schedule work, Alerts for notifications, and More for catalog, people, analytics, and configuration.',
    ),
    simpleTable(
      ['Tab', 'How it works'],
      [
        ['Home', 'Next booking, KPIs, revenue, shortcuts into common tasks'],
        ['Bookings', 'Searchable appointment list; create and open details'],
        ['Calendar', 'Pick a day; work that day’s agenda and open slots'],
        ['Alerts', 'Business notifications; tap to mark read / open booking'],
        ['More', 'Customers, services, staff, reviews, BI, offices, settings, team, profile'],
      ],
    ),
    p(''),
    ...figure('ops-01-sign-in.png', 'Figure 1 — Sign in is the entry point before the tab shell loads.'),

    pageBreak(),
    heading('2. Authentication'),
    heading('2.1 Sign in', HeadingLevel.HEADING_2),
    p(
      'What this screen does: authenticates an owner, manager, or staff user and loads their workspace.',
    ),
    howItWorksHeader(),
    numbered('Enter Email and Password.'),
    numbered('Leave Remember me on to keep the session on this device (default on).'),
    numbered('Tap Sign in.'),
    numbered('On success, the workspace loads and you land on Home.'),
    numbered('If Face ID / biometrics were enabled earlier, you may unlock without typing the password each time.'),
    p('Also on this screen: Forgot password? and Register free.'),
    ...figure('ops-01-sign-in.png', 'Figure 2 — Sign in fields and account links.'),

    heading('2.2 Forgot password', HeadingLevel.HEADING_2),
    p('What this screen does: starts a password reset for an existing account.'),
    howItWorksHeader(),
    numbered('Enter the account Email.'),
    numbered('Tap Send reset link.'),
    numbered('The app confirms that if an account exists, a reset email was sent (local/dev: check Mailpit).'),
    numbered('Use Back to sign in to return.'),
    p(
      'You are not told whether the email exists — this protects account privacy.',
      { italics: true, color: '4B5563' },
    ),
    ...figure('ops-02-forgot-password.png', 'Figure 3 — Forgot password.'),

    heading('2.3 Register a new business', HeadingLevel.HEADING_2),
    p('What this screen does: creates a new workspace and owner login through a wizard.'),
    howItWorksHeader(),
    numbered('Step 1 Account — name, email, mobile, password (min 8), confirm password.'),
    numbered('Step 2 Business — legal/display name, business email, phone, address.'),
    numbered('Step 3 Preferences — timezone, currency, language, product (AppointIE).'),
    numbered('Step 4 Branding — optional colors/logo; create workspace or skip branding.'),
    numbered('When finished, you are signed into the new workspace automatically.'),
    ...figure('ops-03-register-step1.png', 'Figure 4 — Register Step 1 (Account).'),

    pageBreak(),
    heading('3. Daily operations'),
    heading('3.1 Home / Dashboard', HeadingLevel.HEADING_2),
    p(
      'What this screen does: acts as a control center for the day — what is next, key counts, and shortcuts so you rarely hunt through menus.',
    ),
    howItWorksHeader(),
    numbered('Header shows workspace name and a time-based greeting.'),
    numbered('Next up today highlights the next appointment, or prompts you to create one if empty.'),
    numbered('KPI tiles show Today bookings, Customers, Staff, and Services counts.'),
    numbered('Est. revenue · 30 days estimates recent revenue (managers/owners) and opens BI when tapped.'),
    numbered('Quick actions jump into Booking, Customers, Services, or Staff.'),
    numbered('Upcoming today lists the next appointments; tap one for detail or See all for the Bookings tab.'),
    numbered('Pull down to refresh data.'),
    ...figure('ops-04-home.png', 'Figure 5 — Home dashboard with KPIs and shortcuts.'),

    heading('3.2 Bookings list', HeadingLevel.HEADING_2),
    p('What this screen does: shows appointments for operational work, especially today’s schedule.'),
    howItWorksHeader(),
    numbered('Open the Bookings tab.'),
    numbered('Search by booking number, customer, service, staff, or status.'),
    numbered('Use Today/All chips and Filters for status, staff (managers+), and sort order.'),
    numbered('Each card shows service, time, customer, staff, status, and booking number.'),
    numbered('Tap a card to open Booking detail; tap New/+ to create a booking.'),
    p('Common statuses: pending, confirmed, checked_in, in_progress, completed, cancelled, no_show.'),
    ...figure('ops-05-bookings.png', 'Figure 6 — Bookings list with DEMO-BK rows.'),

    heading('3.3 Booking detail — status actions', HeadingLevel.HEADING_2),
    p(
      'What this screen does: progresses one appointment through its lifecycle and keeps optional reasons for audit.',
    ),
    howItWorksHeader(),
    numbered('Open a booking from Home, Bookings, Calendar, or Alerts.'),
    numbered('Review service, number, status, customer, staff, when, duration, price, notes, and any review.'),
    numbered('Use Reason when cancelling/rescheduling so the change is traceable.'),
    p('Action availability by status:'),
    simpleTable(
      ['Action', 'When it appears', 'Result'],
      [
        ['Confirm', 'pending / draft', 'Accepts the appointment onto the schedule'],
        ['Check in', 'confirmed / pending', 'Marks the customer as arrived'],
        ['Complete', 'confirmed / checked_in / in_progress', 'Marks the visit finished'],
        ['Reschedule', 'Not cancelled/completed/rejected', 'Pick a new open slot'],
        ['Cancel booking', 'Not already finished/cancelled', 'Cancels the appointment'],
      ],
    ),
    p(''),
    ...figure('ops-36-booking-detail.jpeg', 'Figure 7 — Booking detail actions.'),

    pageBreak(),
    heading('3.4 Create booking — three-step flow', HeadingLevel.HEADING_2),
    p(
      'What this screen does: creates a new operations booking from the phone (mobile channel).',
    ),
    p('Step A — Who & what', { bold: true }),
    numbered('Select Customer (required) and Service (required — drives duration and slots).'),
    numbered('Select Office when more than one location exists.'),
    numbered('Optionally choose Staff, or leave Any available.'),
    numbered('Changing service/staff clears a previously picked time so slots stay valid.'),
    p('Step B — Date & time', { bold: true }),
    numbered('Pick a day on the month calendar.'),
    numbered('The app loads only open slots for that service/staff/duration.'),
    numbered('If you see “Select a service…”, go back and choose a service first.'),
    numbered('Tap a slot to select it.'),
    p('Step C — Notes', { bold: true }),
    numbered('Optionally add team notes.'),
    numbered('Tap Create booking.'),
    numbered('On success you open the new booking detail; it also appears on Bookings/Calendar.'),
    ...figure('ops-06-new-booking-who.png', 'Figure 8 — Create booking: Who & what.'),
    ...figure('ops-07-new-booking-when.png', 'Figure 9 — Create booking: slots and notes.'),

    heading('3.5 Calendar', HeadingLevel.HEADING_2),
    p('What this screen does: lets you plan by date and jump into free slots.'),
    howItWorksHeader(),
    numbered('Open Calendar and move months with the arrows.'),
    numbered('Tap a day; Day agenda lists that day’s bookings.'),
    numbered('Filter by status/staff (managers+) when needed.'),
    numbered('Tap a booking for detail actions.'),
    numbered('Tap an open slot (when shown) to start Create booking with that start time.'),
    numbered('Empty day → use New booking to fill the schedule.'),
    ...figure('ops-08-calendar.png', 'Figure 10 — Calendar grid and day agenda.'),

    heading('3.6 Alerts', HeadingLevel.HEADING_2),
    p(
      'What this screen does: shows business notifications so you can react without manually refreshing Bookings.',
    ),
    howItWorksHeader(),
    numbered('Open Alerts (badge shows unread count when available).'),
    numbered('Each row has subject, body, and relative time.'),
    numbered('Typical events: new request, check-in, review, daily digest, cancellation, no-show.'),
    numbered('Tap a row to mark it read; linked notifications open the booking detail.'),
    numbered('Use Mark all read to clear unread state; pull to refresh.'),
    ...figure('ops-09-alerts.png', 'Figure 11 — Alerts inbox.'),

    heading('3.7 Global search', HeadingLevel.HEADING_2),
    p('What this screen does: finds customers, staff, or services from one field.'),
    howItWorksHeader(),
    numbered('Open Search and type part of a name (example: fac for Glow Facial).'),
    numbered('Tap a result to open that record.'),
    numbered('If empty, broaden the keyword or check spelling.'),
    ...figure('ops-35-search.png', 'Figure 12 — Search entry.'),
    ...figure('ops-37-search-results.jpeg', 'Figure 13 — Search results.'),

    pageBreak(),
    heading('4. Catalog & people'),
    heading('4.1 Services', HeadingLevel.HEADING_2),
    p('What this module does: maintains what customers can book — name, duration, price, status, image.'),
    howItWorksHeader(),
    numbered('Open More → Services (or Home quick action).'),
    numbered('Search by name; each row shows duration, price, and active status.'),
    numbered('Open detail for description and Book this service (starts create-booking with that service).'),
    numbered('Edit to change image, name, description, duration, and price; save updates the catalog for future bookings.'),
    ...figure('ops-10-services.png', 'Figure 14 — Services list.'),
    ...figure('ops-11-service-detail.png', 'Figure 15 — Service detail.'),
    ...figure('ops-12-edit-service.png', 'Figure 16 — Edit service form.'),

    heading('4.2 Customers', HeadingLevel.HEADING_2),
    p('What this module does: stores people you book for, with contact info and review history.'),
    howItWorksHeader(),
    numbered('Open More → Customers; search by name/email.'),
    numbered('Add customer collects display/first/last name, email, phone, optional address.'),
    numbered('Address can use Google Places when EXPO_PUBLIC_GOOGLE_PLACES_API_KEY is set; otherwise enter manually.'),
    numbered('Detail shows contact, recent reviews (open related booking), New booking, and edit/deactivate when allowed.'),
    numbered('New booking from detail prefills that customer.'),
    ...figure('ops-13-customers.png', 'Figure 17 — Customers list.'),
    ...figure('ops-14-customer-detail.png', 'Figure 18 — Customer detail.'),
    ...figure('ops-39-add-customer.jpeg', 'Figure 19 — Add customer form.'),

    heading('4.3 Staff', HeadingLevel.HEADING_2),
    p(
      'What this module does: defines who can be assigned to appointments, when they work, and whether they can log into OPS Mobile.',
    ),
    howItWorksHeader(),
    numbered('Managers/owners open More → Staff and select a person.'),
    numbered('Detail shows contact, login-linked status, schedule preview, edit/schedule/book/deactivate actions.'),
    numbered('Available for bookings — when off, they are not offered as a bookable stylist.'),
    numbered('Role Staff = bookings/calendar/customers only; Manager also gets Settings, Team, staff directory, reports/BI.'),
    numbered('Weekly schedule sets working days and Start/End times used by availability.'),
    numbered('Leave, extra hours, and service assignments further refine when and what they can do.'),
    ...figure('ops-15-staff.png', 'Figure 20 — Staff list.'),
    ...figure('ops-16-staff-detail.png', 'Figure 21 — Staff detail.'),
    ...figure('ops-17-edit-staff-profile.png', 'Figure 22 — Edit staff profile.'),
    ...figure('ops-18-edit-staff-access.png', 'Figure 23 — Bookable toggle and roles.'),
    ...figure('ops-40-staff-schedule.jpeg', 'Figure 24 — Weekly schedule editor.'),

    pageBreak(),
    heading('5. More menu, analytics, and settings'),
    heading('5.1 More menu', HeadingLevel.HEADING_2),
    p('What this screen does: launches modules that are not bottom tabs.'),
    howItWorksHeader(),
    numbered('Open More to see signed-in user, workspace, and role.'),
    numbered('Tap Customers, Reviews, Services, Staff, BI, Reports, Offices, Settings, or Team.'),
    numbered('Modules you are not allowed to see (for example BI for Staff) are hidden.'),
    ...figure('ops-19-more-menu.png', 'Figure 25 — More menu.'),

    heading('5.2 Reviews', HeadingLevel.HEADING_2),
    p('What this screen does: aggregates ratings/comments from completed bookings.'),
    howItWorksHeader(),
    numbered('Open More → Reviews and search by customer/service/note.'),
    numbered('Each card shows customer, service, booking number, time, and comment.'),
    numbered('Tap through to the related booking when linked.'),
    numbered('Reviews appear after customers rate completed visits.'),
    ...figure('ops-20-reviews.png', 'Figure 26 — Reviews list.'),

    heading('5.3 Business intelligence', HeadingLevel.HEADING_2),
    p(
      'What this module does: turns recent booking history into insights. Some tabs may require Pro/trial entitlements.',
    ),
    howItWorksHeader(),
    numbered('Open More → Business intelligence (or Reports).'),
    numbered('Overview — bookings, est. revenue, completion/no-show/cancel rates, insights.'),
    numbered('Growth — new vs returning customers, repeat rate, most active customers.'),
    numbered('Revenue — estimated vs completed revenue and contribution by service.'),
    numbered('Forecast — projected bookings/revenue from recent history.'),
    numbered('Reports — combined ops summary and recent daily trend.'),
    numbered('If a tab is locked, renew/upgrade under Products & plans.'),
    ...figure('ops-21-bi-overview.png', 'Figure 27 — BI Overview.'),
    ...figure('ops-22-bi-growth.png', 'Figure 28 — BI Growth.'),
    ...figure('ops-23-bi-revenue.png', 'Figure 29 — BI Revenue.'),
    ...figure('ops-24-bi-forecast.png', 'Figure 30 — BI Forecast.'),
    ...figure('ops-25-bi-reports.png', 'Figure 31 — Operations report.'),

    pageBreak(),
    heading('5.4 Offices', HeadingLevel.HEADING_2),
    p('What this screen does: defines physical locations used when creating bookings.'),
    howItWorksHeader(),
    numbered('Open More → Offices (or Settings → Offices).'),
    numbered('At least one office is required; each needs full address + map pin.'),
    numbered('Set one office as Primary (default when relevant).'),
    numbered('Add offices within your plan limit (trial/Pro allow more than Starter).'),
    ...figure('ops-26-offices.png', 'Figure 32 — Offices list.'),

    heading('5.5 Settings and Business Profile', HeadingLevel.HEADING_2),
    p('What Settings does: central configuration for the workspace.'),
    howItWorksHeader(),
    numbered('Open More → Settings.'),
    numbered('Business Profile — view/edit legal name, contact, address, branding, timezone, currency.'),
    numbered('Products & plans — subscription, usage, loyalty.'),
    numbered('Offices / Team & invitations — locations and access.'),
    numbered('Edit business saves profile used across OPS Mobile and customer-facing branding.'),
    ...figure('ops-27-settings.png', 'Figure 33 — Settings hub.'),
    ...figure('ops-28-business-profile.png', 'Figure 34 — Business Profile view.'),
    ...figure('ops-38-edit-business.jpeg', 'Figure 35 — Edit business form.'),

    heading('5.6 Products, billing, and reward points', HeadingLevel.HEADING_2),
    p(
      'What this screen does: shows active product/plan, trial dates, seat usage, and loyalty rules.',
    ),
    howItWorksHeader(),
    numbered('Open Settings → Products & plans.'),
    numbered('Review AppointIE status (e.g. trialing) and change/update/unsubscribe as allowed.'),
    numbered('Plan & usage shows staff/office seats used vs max, trial end, period dates, renew date, add-ons.'),
    numbered('Reward points — enable for customers; set points per currency unit, max redeem %, min redeem; Save.'),
    numbered('When enabled, customers earn on completed services and can redeem on booking within those rules.'),
    ...figure('ops-29-products-billing.png', 'Figure 36 — Products & billing.'),
    ...figure('ops-30-plan-usage.png', 'Figure 37 — Plan usage and trial dates.'),
    ...figure('ops-31-reward-points.png', 'Figure 38 — Reward points configuration.'),

    pageBreak(),
    heading('5.7 Team and invitations', HeadingLevel.HEADING_2),
    p('What this screen does: grants OPS-Mobile login access and shows who is linked.'),
    howItWorksHeader(),
    numbered('Open More → Team.'),
    numbered('Invite with email + Staff or Manager role, then Send invitation.'),
    numbered('Accepting creates/links a staff profile and login.'),
    numbered('Staff directory shows whether login is linked.'),
    numbered('Members with app access lists roles; pending invites can be revoked when shown.'),
    ...figure('ops-32-team.png', 'Figure 39 — Team invite and directory.'),
    ...figure('ops-33-team-members.png', 'Figure 40 — Members with app access.'),

    heading('5.8 Profile / account', HeadingLevel.HEADING_2),
    p('What this screen does: manages your personal login (not the whole business profile).'),
    howItWorksHeader(),
    numbered('Open More → Profile.'),
    numbered('Edit profile — photo, name, phone, language, timezone.'),
    numbered('Change password — updates credentials (may disable biometrics until re-enabled).'),
    numbered('Sessions — review active sessions.'),
    numbered('Face ID login — enable/disable biometric unlock on this device.'),
    numbered('Sign out — ends the local session and returns to Sign in.'),
    ...figure('ops-34-profile.png', 'Figure 41 — Profile and security options.'),

    pageBreak(),
    heading('6. How-to flows (end-to-end)'),
    heading('6.1 Create a booking', HeadingLevel.HEADING_2),
    numbered('Bookings → New booking (or Home → Booking).'),
    numbered('Select customer + service; office if prompted; staff or Any available.'),
    numbered('Choose a day and open slot; add notes if needed → Create booking.'),
    numbered('Confirm detail opens and the card appears under Bookings/Calendar.'),
    p('If slots are empty: check staff schedule, leave, service duration, office, and business hours.', {
      italics: true,
      color: '4B5563',
    }),

    heading('6.2 Run today’s appointment', HeadingLevel.HEADING_2),
    numbered('Open today’s booking from Bookings or Calendar.'),
    numbered('If pending, tap Confirm.'),
    numbered('On arrival tap Check in; when finished tap Complete.'),
    numbered('Use Reschedule or Cancel with a reason if plans change.'),

    heading('6.3 Add a customer and book them', HeadingLevel.HEADING_2),
    numbered('More → Customers → Add customer; enter identity/contact; save.'),
    numbered('Open the customer → New booking and finish the create flow.'),

    heading('6.4 Update a service', HeadingLevel.HEADING_2),
    numbered('More → Services → open service → Edit duration/price/image/description → Save.'),

    heading('6.5 Make a stylist bookable', HeadingLevel.HEADING_2),
    numbered('More → Staff → open person → enable Available for bookings.'),
    numbered('Set Staff or Manager role; configure weekly schedule; optionally send invitation.'),

    heading('6.6 Invite a manager', HeadingLevel.HEADING_2),
    numbered('More → Team → enter email → Manager → Send invitation.'),
    numbered('After accept, confirm Login linked and Manager role.'),

    heading('6.7 Check plan limits and reward points', HeadingLevel.HEADING_2),
    numbered('Settings → Products & plans → review seats/trial dates.'),
    numbered('Enable Reward points and configure earn/redeem rules → Save.'),

    heading('6.8 Review performance in BI', HeadingLevel.HEADING_2),
    numbered('More → Business intelligence.'),
    numbered('Start with Overview, then Growth, Revenue, Forecast, and Reports.'),

    pageBreak(),
    heading('7. Troubleshooting'),
    simpleTable(
      ['Problem', 'What to do'],
      [
        ['Sign-in fails', 'Check email/password; Forgot password; confirm account is active'],
        ['No open slots', 'Select service; ensure staff is bookable/scheduled and not on leave'],
        ['Staff missing from picker', 'Enable Available for bookings; confirm employment active'],
        ['Cannot open Settings/BI', 'Signed in as Staff — need Manager/Owner'],
        ['Cannot add office/staff', 'Plan limit or soft lock — check Products & plans'],
        ['Places address not suggesting', 'Set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY and reload app'],
        ['Soft-lock banner', 'Trial/period ended — renew/change plan'],
        ['Alerts empty', 'No events yet, or wrong workspace; booking activity generates alerts'],
      ],
    ),
    p(''),
    heading('8. Related documents'),
    bullet('IE-0005 Functional Requirements Specification'),
    bullet('IE-0005.01 Customer Mobile App Functional Specification'),
    bullet('IE-0005.02 Business Dashboard Functional Specification'),
    bullet('AppointIE product folder README'),
    heading('9. Optional later captures'),
    bullet('Register wizard steps 2–4'),
    bullet('Accept invitation'),
    bullet('Workspace picker'),
    p(''),
    p('End of IE-0005.04 OPS Mobile App User Guide.', { italics: true, color: '6B7280' }),
  ];

  const doc = new Document({
    creator: 'IE Platform',
    title: 'IE-0005.04 AppointIE OPS Mobile App User Guide',
    description: 'OPS Mobile user guide with detailed how-it-works content and Demo Salon screenshots',
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
        {
          reference: 'numbers',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: MARGIN_DXA,
              bottom: MARGIN_DXA,
              left: MARGIN_DXA,
              right: MARGIN_DXA,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  try {
    fs.writeFileSync(outPath, buffer);
    console.log(`Wrote ${outPath} (${buffer.length} bytes)`);
  } catch (err) {
    if (err && (err.code === 'EBUSY' || err.code === 'EPERM')) {
      fs.writeFileSync(outPathAlt, buffer);
      console.log(
        `Primary file locked; wrote ${outPathAlt} (${buffer.length} bytes). Close Word and rename/replace the main file.`,
      );
    } else {
      throw err;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
