/**
 * Build OPS Mobile sample Word guide with captured screenshots.
 * Usage: node scripts/build-ops-mobile-sample-docx.mjs
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
const imagesDir = path.join(
  docsRoot,
  'docs/06-products/AppointIE/ops-mobile-sample-images',
);
const outPath = path.join(
  docsRoot,
  'docs/06-products/AppointIE/SAMPLE-OPS-Mobile-App-User-Guide-Preview.docx',
);

const PAGE_WIDTH_DXA = 12240;
const MARGIN_DXA = 720;
const CONTENT_WIDTH_DXA = PAGE_WIDTH_DXA - MARGIN_DXA * 2;

// Portrait phone screenshots
const IMAGE_WIDTH_PX = 280;
const IMAGE_HEIGHT_PX = 606;

function loadImage(name) {
  const filePath = path.join(imagesDir, name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image: ${filePath}`);
  }
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
    spacing: { before: 260, after: 140 },
    children: [new TextRun({ text, font: 'Calibri', bold: true })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 70 },
    children: [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { after: 70 },
    children: [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function figure(imageName, caption) {
  const { data, ext } = loadImage(imageName);
  const type = ext === '.jpeg' || ext === '.jpg' ? 'jpg' : 'png';
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
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
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: caption,
          font: 'Calibri',
          size: 18,
          italics: true,
          color: '4B5563',
        }),
      ],
    }),
  ];
}

function simpleTable(headers, rows) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' };
  const borders = { top: border, bottom: border, left: border, right: border };
  const colW = Math.floor(CONTENT_WIDTH_DXA / headers.length);
  const headerRow = new TableRow({
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
  });
  const body = rows.map(
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
  );
  return new Table({
    width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
    rows: [headerRow, ...body],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function sectionCatalog(title, purpose, regions, actions, imageName, caption) {
  return [
    heading(title, HeadingLevel.HEADING_2),
    p(purpose),
    heading('Main regions', HeadingLevel.HEADING_3),
    simpleTable(['Region', 'What it shows'], regions),
    p(''),
    heading('Key actions', HeadingLevel.HEADING_3),
    ...actions.map((a) => bullet(a)),
    ...figure(imageName, caption),
  ];
}

async function main() {
  const children = [
    heading('AppointIE OPS Mobile App User Guide'),
    p('Sample Preview — Demo Salon screenshots', { size: 28, bold: true, color: '1D4ED8' }),
    p(
      'This sample shows the format for an OPS Mobile feature catalog + how-to guide. Screenshots were captured on iOS (Expo Go) from the seeded Demo Salon workspace.',
      { italics: true, color: '374151' },
    ),
    p('Audience: Business owners, managers, and staff'),
    p('App: OPS Mobile (apps/ops-mobile)'),
    p('Demo workspace: Demo Salon (demo / MAIN)'),
    p('Owner login: pilot-owner@ieplatform.local / PilotPass123!'),

    heading('1. Overview'),
    p(
      'OPS Mobile is the on-the-go operations app for AppointIE. Use it to manage today’s bookings, customers, services, staff, offices, billing, and business intelligence without opening the web dashboard.',
    ),
    p('The app has five primary tabs:'),
    bullet('Home — daily snapshot and quick actions'),
    bullet('Bookings — today’s schedule and booking management'),
    bullet('Calendar — month view and day agenda'),
    bullet('Alerts — business notifications'),
    bullet('More — customers, services, staff, BI, settings, team, profile'),

    pageBreak(),
    heading('2. Getting started (Auth)'),
    heading('Sign in', HeadingLevel.HEADING_2),
    p('Open OPS Mobile and sign in with your business owner or staff credentials.'),
    ...figure('ops-01-sign-in.png', 'Figure 1 — Sign in screen.'),
    heading('Forgot password', HeadingLevel.HEADING_2),
    p('Request a reset link if you cannot sign in.'),
    ...figure('ops-02-forgot-password.png', 'Figure 2 — Forgot password.'),
    heading('Register business', HeadingLevel.HEADING_2),
    p('New businesses can start self-service registration (Step 1 of 4 shown).'),
    ...figure('ops-03-register-step1.png', 'Figure 3 — Register business (Step 1).'),

    pageBreak(),
    heading('3. Feature catalog — Daily operations'),
    ...sectionCatalog(
      'Home / Dashboard',
      'Your landing screen after sign-in. Shows counts, estimated revenue, and quick entry points.',
      [
        ['Greeting / workspace', 'Business name and time-of-day greeting'],
        ['KPI tiles', 'Today, customers, staff, services'],
        ['Revenue', 'Estimated revenue for the last 30 days'],
        ['Quick actions', 'Shortcuts into Booking, Customers, Services, Staff'],
        ['Upcoming today', 'Next appointments for the current day'],
      ],
      ['Open Bookings to manage today’s schedule', 'Use quick actions to jump into create flows'],
      'ops-04-home.png',
      'Figure 4 — Home dashboard (Demo Salon).',
    ),
    ...sectionCatalog(
      'Bookings',
      'Today’s schedule list with status and search/filter controls.',
      [
        ['Search', 'Find bookings by customer, service, or number'],
        ['Booking cards', 'Service, time, customer, staff, status, booking number'],
        ['Filters', 'Narrow the list by status or other criteria'],
      ],
      ['Tap a booking to open detail', 'Create a new booking from the + / New booking action'],
      'ops-05-bookings.png',
      'Figure 5 — Bookings list with DEMO-BK rows.',
    ),
    heading('Booking detail', HeadingLevel.HEADING_2),
    p('Open a booking to check in, complete, reschedule, or cancel.'),
    ...figure(
      'ops-36-booking-detail.jpeg',
      'Figure 6 — Booking detail (DEMO-BK-019) with Check in / Complete / Reschedule / Cancel.',
    ),
    heading('Create a booking', HeadingLevel.HEADING_2),
    p('Goal: create an appointment for an existing customer.'),
    numbered('From Bookings (or Home quick action), open New booking.'),
    numbered('Select Customer, Service, Office, and optional Staff.'),
    numbered('Pick an available date/time slot.'),
    numbered('Add optional notes, then Create booking.'),
    ...figure('ops-06-new-booking-who.png', 'Figure 7 — New booking: Who & what.'),
    ...figure('ops-07-new-booking-when.png', 'Figure 8 — New booking: Date & time + notes.'),

    pageBreak(),
    ...sectionCatalog(
      'Calendar',
      'Month calendar with the selected day’s agenda underneath.',
      [
        ['Month grid', 'Navigate months and select a day'],
        ['Day agenda', 'Bookings for the selected date'],
        ['Filters', 'Focus the agenda'],
      ],
      ['Tap a day to refresh the agenda', 'Open a booking card for detail actions'],
      'ops-08-calendar.png',
      'Figure 9 — Calendar month + day agenda.',
    ),
    ...sectionCatalog(
      'Alerts',
      'Business notification inbox for booking events, reviews, and schedule digests.',
      [
        ['Notification rows', 'Subject, body, relative time'],
        ['Mark all read', 'Clear unread state'],
      ],
      ['Tap Mark all read when catching up', 'Use Alerts to monitor new requests and cancellations'],
      'ops-09-alerts.png',
      'Figure 10 — Business notifications / Alerts.',
    ),
    ...sectionCatalog(
      'Global search',
      'Search across customers, staff, and services from one place.',
      [
        ['Search field', 'Type a name or keyword'],
        ['Results', 'Matching services/customers/staff'],
      ],
      ['Search a service name (example: facial) to jump quickly'],
      'ops-37-search-results.jpeg',
      'Figure 11 — Search results (Glow Facial).',
    ),

    pageBreak(),
    heading('4. Feature catalog — Catalog & people'),
    ...sectionCatalog(
      'Services',
      'Browse active services with duration and price.',
      [
        ['Search', 'Filter the catalog'],
        ['Service rows', 'Name, duration, price, status'],
      ],
      ['Open a service for detail', 'Edit duration/price/image as needed'],
      'ops-10-services.png',
      'Figure 12 — Services list.',
    ),
    ...figure('ops-11-service-detail.png', 'Figure 13 — Service detail (Glow Facial).'),
    ...figure('ops-12-edit-service.png', 'Figure 14 — Edit service form.'),

    ...sectionCatalog(
      'Customers',
      'Customer directory for the workspace (12 seeded Demo Salon customers).',
      [
        ['Search', 'Find by name/email'],
        ['Customer rows', 'Name, email, status'],
      ],
      ['Open a customer for contact + reviews', 'Add a new customer from the create flow'],
      'ops-13-customers.png',
      'Figure 15 — Customers list.',
    ),
    ...figure('ops-14-customer-detail.png', 'Figure 16 — Customer detail with reviews.'),
    ...figure('ops-39-add-customer.jpeg', 'Figure 17 — Add customer form.'),

    ...sectionCatalog(
      'Staff',
      'Team directory for bookable stylists and managers.',
      [
        ['Staff rows', 'Name, email, status'],
        ['Detail', 'Contact, schedule, app login, deactivate'],
      ],
      ['Edit profile/contact', 'Configure weekly schedule', 'Set Staff vs Manager app access'],
      'ops-15-staff.png',
      'Figure 18 — Staff list.',
    ),
    ...figure('ops-16-staff-detail.png', 'Figure 19 — Staff detail (Demo Manager).'),
    ...figure('ops-17-edit-staff-profile.png', 'Figure 20 — Edit staff profile.'),
    ...figure('ops-18-edit-staff-access.png', 'Figure 21 — Booking availability + role access.'),
    ...figure('ops-40-staff-schedule.jpeg', 'Figure 22 — Weekly schedule editor.'),

    pageBreak(),
    heading('5. Feature catalog — More menu, BI, settings'),
    ...sectionCatalog(
      'More menu',
      'Hub for secondary modules not in the bottom tabs.',
      [
        ['Account header', 'Signed-in user and role'],
        ['Business links', 'Customers, Reviews, Services, Staff, BI, Reports, Offices, Settings, Team'],
      ],
      ['Open Settings for profile/billing/team', 'Open BI for analytics tabs'],
      'ops-19-more-menu.png',
      'Figure 23 — More menu.',
    ),
    ...sectionCatalog(
      'Reviews',
      'Customer reviews linked to completed bookings.',
      [
        ['Search', 'Filter by customer/service/note'],
        ['Review cards', 'Rating, service, booking number, comment'],
      ],
      ['Use reviews to monitor service quality'],
      'ops-20-reviews.png',
      'Figure 24 — Reviews list.',
    ),

    heading('Business intelligence', HeadingLevel.HEADING_2),
    p('BI covers Overview, Growth, Revenue, Forecast, and Reports for the last 30 days.'),
    ...figure('ops-21-bi-overview.png', 'Figure 25 — BI Overview.'),
    ...figure('ops-22-bi-growth.png', 'Figure 26 — BI Growth.'),
    ...figure('ops-23-bi-revenue.png', 'Figure 27 — BI Revenue.'),
    ...figure('ops-24-bi-forecast.png', 'Figure 28 — BI Forecast.'),
    ...figure('ops-25-bi-reports.png', 'Figure 29 — BI / Operations report.'),

    pageBreak(),
    ...sectionCatalog(
      'Offices',
      'Manage locations used for bookings. Each office needs address + map pin.',
      [
        ['Office cards', 'Name, address, coordinates, primary flag'],
        ['Add office', 'Create additional locations (within plan limits)'],
      ],
      ['Set primary office', 'Keep address/map pin complete for each office'],
      'ops-26-offices.png',
      'Figure 30 — Offices (Baner + Kalyani Nagar).',
    ),
    ...sectionCatalog(
      'Settings',
      'Workspace configuration entry point.',
      [
        ['Business Profile', 'Legal name, contact, address'],
        ['Products & plans', 'Billing, trial, add-ons, reward points'],
        ['Offices', 'Location management'],
        ['Team & invitations', 'Invite and manage app access'],
      ],
      ['Update branding/contact under Business Profile', 'Manage plan/trial under Products & plans'],
      'ops-27-settings.png',
      'Figure 31 — Settings hub.',
    ),
    ...figure('ops-28-business-profile.png', 'Figure 32 — Business Profile view.'),
    ...figure('ops-38-edit-business.jpeg', 'Figure 33 — Edit business form.'),
    ...figure('ops-29-products-billing.png', 'Figure 34 — Products & billing.'),
    ...figure('ops-30-plan-usage.png', 'Figure 35 — Plan & usage / trial dates.'),
    ...figure('ops-31-reward-points.png', 'Figure 36 — Reward points settings.'),

    heading('Team', HeadingLevel.HEADING_2),
    p('Invite teammates and see who has OPS-Mobile login access.'),
    ...figure('ops-32-team.png', 'Figure 37 — Team invite + staff directory.'),
    ...figure('ops-33-team-members.png', 'Figure 38 — Members with app access.'),

    heading('Profile / account', HeadingLevel.HEADING_2),
    p('Manage your personal account: edit profile, password, sessions, Face ID, sign out.'),
    ...figure('ops-34-profile.png', 'Figure 39 — Profile / account screen.'),

    pageBreak(),
    heading('6. How-to recipes (quick)'),
    heading('Create a booking', HeadingLevel.HEADING_2),
    numbered('Open Bookings → New booking.'),
    numbered('Select customer, service, office, optional staff.'),
    numbered('Choose an open slot and create.'),
    numbered('Confirm the new row appears on Bookings/Calendar.'),
    heading('Check in a customer', HeadingLevel.HEADING_2),
    numbered('Open Bookings → select today’s appointment.'),
    numbered('On detail, tap Check in (then Complete when finished).'),
    heading('Add a customer', HeadingLevel.HEADING_2),
    numbered('More → Customers → Add customer.'),
    numbered('Enter identity/contact (and optional address).'),
    numbered('Save, then use New booking from the customer detail.'),
    heading('Invite a teammate', HeadingLevel.HEADING_2),
    numbered('More → Team.'),
    numbered('Enter email, choose Staff or Manager, send invitation.'),
    numbered('After accept, confirm login-linked status in the directory.'),

    heading('7. Screenshot inventory in this sample'),
    simpleTable(
      ['Area', 'Figures'],
      [
        ['Auth', '1–3'],
        ['Home / Bookings / Calendar / Alerts / Search', '4–11'],
        ['Services / Customers / Staff', '12–22'],
        ['More / Reviews / BI', '23–29'],
        ['Offices / Settings / Billing / Team / Profile', '30–39'],
      ],
    ),
    p(''),
    p(
      'Still optional for a later revision: Register wizard steps 2–4, Accept invitation, Workspace picker.',
      { italics: true, color: '6B7280' },
    ),
    p('End of OPS Mobile sample preview.', { italics: true, color: '6B7280' }),
  ];

  const doc = new Document({
    creator: 'IE Platform',
    title: 'AppointIE OPS Mobile App User Guide — Sample Preview',
    description: 'Sample OPS Mobile guide with Demo Salon iOS screenshots',
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
  fs.writeFileSync(outPath, buffer);
  console.log(`Wrote ${outPath} (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
