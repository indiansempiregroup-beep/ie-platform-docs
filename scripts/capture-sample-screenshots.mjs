/**
 * Capture Demo Salon screenshots for the SAMPLE user-guide preview.
 * Usage (from ie-platform-docs): node scripts/capture-sample-screenshots.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../assets/images/appointie/web-ops');
const baseUrl = process.env.WEB_BASE_URL || 'http://127.0.0.1:3000';
const email = process.env.DEMO_OWNER_EMAIL || 'pilot-owner@ieplatform.local';
const password = process.env.DEMO_OWNER_PASSWORD || 'PilotPass123!';

fs.mkdirSync(outDir, { recursive: true });

async function settle(page, ms = 1000) {
  await page.waitForTimeout(ms);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log(`Opening ${baseUrl}/auth …`);
  await page.goto(`${baseUrl}/auth`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type="email"]', { timeout: 30000 });

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);

  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith('/auth'), { timeout: 45000 }),
    page.getByRole('button', { name: /sign in/i }).click(),
  ]);

  console.log(`Logged in → ${page.url()}`);

  const demoOption = page.getByText(/Demo Salon/i).first();
  if (await demoOption.isVisible().catch(() => false)) {
    await demoOption.click();
    await settle(page, 1200);
  }

  if (!page.url().includes('/dashboard')) {
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });
  }
  await page.waitForLoadState('networkidle').catch(() => {});
  await settle(page, 2000);

  // Dismiss onboarding welcome if present.
  const dismiss = page.getByRole('button', { name: /dismiss|got it|close|skip/i }).first();
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click().catch(() => {});
    await settle(page, 500);
  }

  await page.screenshot({
    path: path.join(outDir, 'sample-01-app-shell.png'),
    fullPage: false,
  });
  console.log('Wrote sample-01-app-shell.png');

  await page.screenshot({
    path: path.join(outDir, 'sample-02-dashboard.png'),
    fullPage: false,
  });
  console.log('Wrote sample-02-dashboard.png');

  await page.goto(`${baseUrl}/bookings`, { waitUntil: 'networkidle' });
  await page.getByRole('main').getByRole('heading', { name: 'Bookings', exact: true }).waitFor({
    timeout: 30000,
  });
  await settle(page, 2000);
  await page.screenshot({
    path: path.join(outDir, 'sample-03-bookings-list.png'),
    fullPage: false,
  });
  console.log('Wrote sample-03-bookings-list.png');

  // Booking detail: use BOOKING_ID env, else discover via API with auth + tenant headers.
  let bookingId = process.env.BOOKING_ID || '';
  if (!bookingId) {
    bookingId =
      (await page.evaluate(async () => {
        const access = localStorage.getItem('ie:auth:access') || '';
        const tenantMatch = document.body.innerHTML.match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
        );
        // Prefer tenant from any cached workspace payload in localStorage.
        let tenantId = '';
        for (const key of Object.keys(localStorage)) {
          const value = localStorage.getItem(key) || '';
          if (key.toLowerCase().includes('tenant') && /^[0-9a-f-]{36}$/i.test(value)) {
            tenantId = value;
            break;
          }
          if (!tenantId && value.startsWith('{') && value.includes('tenant')) {
            try {
              const parsed = JSON.parse(value);
              const candidate = parsed?.tenant_id || parsed?.tenantId || parsed?.tenant?.id;
              if (candidate) tenantId = String(candidate);
            } catch {
              /* ignore */
            }
          }
        }
        if (!tenantId && tenantMatch) tenantId = tenantMatch[0];
        const res = await fetch('/api/v1/bookings?page_size=50', {
          headers: {
            Authorization: `Bearer ${access}`,
            ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}),
          },
        });
        if (!res.ok) return '';
        const payload = await res.json();
        const rows = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.results)
            ? payload.data.results
            : [];
        const demo = rows.find((row) => String(row.booking_number || '').startsWith('DEMO-BK-'));
        return String(demo?.id || rows[0]?.id || '');
      })) || '';
  }

  if (bookingId) {
    await page.goto(`${baseUrl}/bookings/${bookingId}`, { waitUntil: 'networkidle' });
    await settle(page, 1500);
    await page.screenshot({
      path: path.join(outDir, 'sample-04-booking-detail.png'),
      fullPage: false,
    });
    console.log(`Wrote sample-04-booking-detail.png (${bookingId})`);
    await page.goto(`${baseUrl}/bookings`, { waitUntil: 'networkidle' });
    await settle(page, 1000);
  } else {
    await page.screenshot({
      path: path.join(outDir, 'sample-04-booking-detail.png'),
      fullPage: false,
    });
    console.log('Wrote sample-04-booking-detail.png (could not resolve booking id)');
  }

  const createBtn = page.getByRole('button', { name: /new booking/i }).first();
  await createBtn.waitFor({ timeout: 15000 });
  await createBtn.click();
  await settle(page, 1200);
  await page.screenshot({
    path: path.join(outDir, 'sample-05-create-booking.png'),
    fullPage: false,
  });
  console.log('Wrote sample-05-create-booking.png');

  await browser.close();
  console.log(`Done. Screenshots in ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
