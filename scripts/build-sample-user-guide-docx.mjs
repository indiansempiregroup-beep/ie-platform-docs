/**
 * Build a Word (.docx) sample of the Business Dashboard User Guide with screenshots.
 * Usage: node scripts/build-sample-user-guide-docx.mjs
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
  'docs/06-products/AppointIE/images',
);
const outPath = path.join(
  docsRoot,
  'docs/06-products/AppointIE/SAMPLE-Business-Dashboard-User-Guide-Preview.docx',
);
const outPathAlt = path.join(
  docsRoot,
  'docs/06-products/AppointIE/SAMPLE-Business-Dashboard-User-Guide-Preview-v0.2.docx',
);

function howItWorksHeader() {
  return p('How it works', { bold: true, size: 22, color: '1D4ED8' });
}

const PAGE_WIDTH_DXA = 12240; // letter
const MARGIN_DXA = 720; // 0.5"
const CONTENT_WIDTH_DXA = PAGE_WIDTH_DXA - MARGIN_DXA * 2;
const IMAGE_WIDTH_PX = 620;
const IMAGE_HEIGHT_PX = 388; // 1440x900 → ~620x388

function loadImage(name) {
  const filePath = path.join(imagesDir, name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image: ${filePath}`);
  }
  return fs.readFileSync(filePath);
}

function p(text, options = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    ...options,
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
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, font: 'Calibri', bold: true })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'numbers', level },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function figure(imageName, caption) {
  const data = loadImage(imageName);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
      children: [
        new ImageRun({
          type: 'png',
          data,
          transformation: { width: IMAGE_WIDTH_PX, height: IMAGE_HEIGHT_PX },
          altText: { title: caption, description: caption, name: imageName },
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
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
  const headerRow = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          borders,
          width: { size: Math.floor(CONTENT_WIDTH_DXA / headers.length), type: WidthType.DXA },
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
              width: {
                size: Math.floor(CONTENT_WIDTH_DXA / headers.length),
                type: WidthType.DXA,
              },
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

async function main() {
  const doc = new Document({
    creator: 'IE Platform',
    title: 'AppointIE Business Dashboard User Guide — Sample Preview',
    description: 'Sample 5-page preview with Demo Salon screenshots',
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
    styles: {
      default: {
        document: {
          styles: [{ id: 'Normal', run: { font: 'Calibri', size: 22 } }],
        },
      },
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
        children: [
          heading('AppointIE Business Dashboard User Guide'),
          p('Sample Preview (≈ 5 pages) · v0.2.0', { size: 28, bold: true, color: '1D4ED8' }),
          p(
            'This is a sample only. Every screen explains what it does and how it works — not only a title and image. Screenshots are real captures from the seeded Demo Salon workspace.',
            { italics: true, color: '374151' },
          ),
          p('Audience: Business owners and managers'),
          p('Surface: AppointIE web dashboard (/dashboard, /bookings, …)'),
          p('Demo login (local): pilot-owner@ieplatform.local / PilotPass123!'),
          p('Workspace: Demo Salon (demo / MAIN)'),

          heading('Page 1 — Overview', HeadingLevel.HEADING_1),
          heading('What this guide covers', HeadingLevel.HEADING_2),
          p(
            'The Business Dashboard is where your team runs day-to-day AppointIE operations: appointments, customers, services, staff, reporting, and business settings.',
          ),
          p('This guide has two parts:'),
          simpleTable(
            ['Part', 'Purpose'],
            [
              ['Feature catalog', 'Screen-by-screen: what you see and how each control works'],
              ['How-to flows', 'Task recipes: step-by-step with screenshots'],
            ],
          ),
          p(''),
          heading('Who can use what', HeadingLevel.HEADING_2),
          simpleTable(
            ['Role', 'Typical access'],
            [
              ['Business owner', 'Full access (operations + settings + billing + team)'],
              ['Manager', 'Operations + most settings (depends on permissions)'],
              ['Staff', 'Limited to assigned bookings and allowed modules'],
            ],
          ),
          p(''),
          heading('App shell — how it works', HeadingLevel.HEADING_2),
          numbered(
            'Left navigation — switches modules. The active item stays highlighted so you always know where you are.',
          ),
          numbered(
            'Top bar — shows the current workspace and account menu. Switch workspace here before trusting any list or KPI.',
          ),
          numbered('Main content — loads the selected module without signing you out.'),
          numbered(
            'Soft-lock / plan banners (when shown) block create/add actions until you renew under Settings → Products.',
          ),
          ...figure(
            'sample-01-app-shell.png',
            'Figure 1 — App shell: Demo Salon workspace with Dashboard selected.',
          ),

          pageBreak(),
          heading('Page 2 — Feature catalog: Dashboard', HeadingLevel.HEADING_1),
          heading('What this screen does', HeadingLevel.HEADING_2),
          p(
            'The Dashboard is your daily home screen. It pulls live booking, customer, staff, and notification data for the active workspace so you can see today’s load and jump into common tasks.',
          ),
          howItWorksHeader(),
          numbered('Open Dashboard in the left nav (default after sign-in).'),
          numbered(
            'Confirm the welcome header shows the correct business name. If not, switch workspace from the account picker.',
          ),
          numbered('Use quick-action icons under the welcome text to jump into create/booking or related modules.'),
          numbered(
            'Type in Search to find customers, bookings, staff, or services; click a result to open that record.',
          ),
          numbered(
            'Optionally set auto-refresh (Manual or every N seconds) so KPI tiles and widgets re-fetch without a full reload.',
          ),
          numbered(
            'Read KPI tiles (today’s/upcoming/completed/cancelled bookings, revenue, customers, staff on duty, occupancy).',
          ),
          numbered('Use Today’s Schedule for the next appointments; open Bookings when you need to confirm or cancel.'),
          numbered('Use Notification Center for unread alerts; open Notifications in the nav when the count is high.'),
          numbered('Scan Recent Activity, Calendar Preview, and Business Summary for supporting context.'),
          numbered(
            'If a Getting started checklist appears, complete or dismiss it (dismiss stores a local preference).',
          ),
          heading('Main regions', HeadingLevel.HEADING_2),
          simpleTable(
            ['Region', 'What it shows / does'],
            [
              ['Welcome + quick actions', 'Workspace greeting and one-click shortcuts'],
              ['Search + refresh', 'Find records; choose how often data reloads'],
              ['KPI tiles', 'Counts and revenue derived from live lists'],
              ['Today’s Schedule', 'Next appointments for today'],
              ['Notification Center', 'Latest alerts with unread highlighting'],
              ['Activity / Calendar / Summary', 'Supporting context for the day'],
            ],
          ),
          p(''),
          heading('Permissions', HeadingLevel.HEADING_2),
          p(
            'Requires at least business:read. Some quick actions also need write permissions (for example booking:write).',
          ),
          ...figure(
            'sample-02-dashboard.png',
            'Figure 2 — Dashboard home with seeded KPIs (today’s bookings, customers, staff, and plan status).',
          ),

          pageBreak(),
          heading('Page 3 — Feature catalog: Bookings', HeadingLevel.HEADING_1),
          heading('What this screen does', HeadingLevel.HEADING_2),
          p(
            'Bookings is the operations list for appointments. Search the queue, confirm or cancel from the row, open detail, or create a new appointment through the booking engine.',
          ),
          howItWorksHeader(),
          numbered('Open Bookings in the left nav.'),
          numbered(
            'Search by booking number, customer, staff, or status (examples: DEMO-BK, Ananya, pending).',
          ),
          numbered('Read each row: date/time, customer, service, staff, status, and available actions.'),
          numbered(
            'Confirm appears only for pending/draft. Clicking it accepts the appointment; status updates in the list.',
          ),
          numbered(
            'Cancel appears when status is not already cancelled/completed. Cancelling removes it from the active schedule.',
          ),
          numbered(
            'Open booking detail for full information — service, customer, staff, timing, notes, and further actions.',
          ),
          numbered('Click Create booking to open the create dialog (see Page 4).'),
          numbered('After create/confirm/cancel, the list refreshes so the new status is visible immediately.'),
          heading('Statuses you will see', HeadingLevel.HEADING_2),
          simpleTable(
            ['Status', 'Meaning', 'Typical next action'],
            [
              ['pending', 'Waiting for confirmation', 'Confirm or Cancel'],
              ['confirmed', 'Accepted and on the schedule', 'Open detail / Cancel if needed'],
              ['checked_in', 'Customer has arrived', 'Complete from detail when available'],
              ['completed', 'Service finished', 'View only'],
              ['cancelled', 'Cancelled', 'View only'],
              ['no_show', 'Customer did not attend', 'View only'],
            ],
          ),
          p(''),
          ...figure(
            'sample-03-bookings-list.png',
            'Figure 3 — Bookings list showing seeded DEMO-BK-* appointments with Confirm / Cancel actions.',
          ),
          ...figure(
            'sample-04-booking-detail.png',
            'Figure 4 — Booking detail for a seeded Demo Salon appointment.',
          ),

          pageBreak(),
          heading('Page 4 — How-to: Create a booking', HeadingLevel.HEADING_1),
          heading('Goal', HeadingLevel.HEADING_2),
          p(
            'Create a new appointment for an existing customer and see it appear on the Bookings list (and Calendar for that date).',
          ),
          heading('Prerequisites', HeadingLevel.HEADING_2),
          bullet('You are signed in as a user with booking write access'),
          bullet('At least one customer, service, staff, and office exist'),
          bullet('Demo Salon seed already provides these'),
          bullet('Soft-lock is not blocking create actions'),
          howItWorksHeader(),
          numbered('In the left nav, open Bookings.'),
          numbered('Click Create booking (primary button in the header).'),
          numbered(
            'Select Customer, Service (sets duration/price context), Staff (must be bookable), Office/branch, and Start date/time inside availability.',
          ),
          numbered('Submit with Create booking (button may show Creating booking… while the API runs).'),
          numbered(
            'Confirm the new row appears with status pending or confirmed, and that it also shows under Calendar for that date.',
          ),
          ...figure(
            'sample-05-create-booking.png',
            'Figure 5 — Create booking dialog: pick customer, service, office, staff, and start time, then submit.',
          ),
          heading('Expected result', HeadingLevel.HEADING_2),
          bullet('A new booking appears in the Bookings list'),
          bullet('It also appears on Calendar for that date'),
          bullet('The customer’s history reflects the new appointment'),
          bullet('Dashboard KPIs / Today’s Schedule update on the next refresh'),
          heading('If something fails', HeadingLevel.HEADING_2),
          simpleTable(
            ['Problem', 'What to check'],
            [
              ['No staff in the dropdown', 'Staff must be active and bookable; check Staff'],
              ['No offices listed', 'Add an office under Settings → Business (Branches/Offices)'],
              ['Time rejected', 'Pick a slot inside business hours / staff availability'],
              ['Soft-lock banner', 'Trial/plan period ended — renew from Settings → Products'],
              ['Create stays pending / errors', 'Confirm API is up; retry after the previous request finishes'],
            ],
          ),

          pageBreak(),
          heading('Page 5 — How the full guide will look', HeadingLevel.HEADING_1),
          heading('Final document outline (not in this sample)', HeadingLevel.HEADING_2),
          p('IE-0005.03 Business Dashboard User Guide'),
          bullet('1. Overview & roles'),
          bullet('2. Getting started (sign-in, workspace, shell)'),
          bullet('3. Feature catalog — Dashboard, Calendar, Bookings, Customers, Services, Staff, Reports & BI, Notifications, Settings, Profile'),
          bullet('4. How-to flows — Create booking, Add customer, Create service, Add staff, Calendar day, Business profile, Billing, Reports & BI'),
          bullet('5. Glossary & related docs'),
          heading('Screenshot conventions (final guide)', HeadingLevel.HEADING_2),
          simpleTable(
            ['Rule', 'Detail'],
            [
              ['Format', 'PNG'],
              ['Folder', 'assets/images/appointie/web-ops/'],
              ['Naming', 'web-ops-<area>-<screen>.png'],
              ['Viewport', 'Desktop ≈ 1280–1440px wide'],
              ['Data', 'Captured from Demo Salon only (fictional customers)'],
              ['Caption', 'Every image has a short Figure N line'],
              ['Prose', 'Every screen has What this screen does + How it works (numbered steps)'],
            ],
          ),
          p(''),
          heading('What changes from this sample to the real guide', HeadingLevel.HEADING_2),
          numbered('Same screenshot style, but for all modules (not just Dashboard + Bookings)'),
          numbered('Every module gets a catalog section with how-it-works steps'),
          numbered('Every major task gets a how-to like “Create a booking”'),
          numbered('Document ID becomes official IE-0005.03 (this file stays a SAMPLE)'),
          numbered('Linked from the AppointIE README document index'),
          p(''),
          p('End of sample preview.', { italics: true, color: '6B7280' }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  try {
    fs.writeFileSync(outPath, buffer);
    console.log(`Wrote ${outPath}`);
  } catch (err) {
    if (err && (err.code === 'EBUSY' || err.code === 'EPERM')) {
      fs.writeFileSync(outPathAlt, buffer);
      console.log(`Primary file locked; wrote ${outPathAlt}`);
    } else {
      throw err;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
