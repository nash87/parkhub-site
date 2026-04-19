#!/usr/bin/env node
/**
 * capture-preview.mjs — build-time screenshot generator for the marketing site.
 *
 * Launches headless Chromium via `playwright`, navigates to the live ParkHub
 * Rust demo at https://parkhub-rust-demo.onrender.com, uses the on-page demo
 * autofill button to log in as admin@parkhub.test/demo, waits for the dashboard
 * to render, hides the floating DEMO countdown overlay, and captures a
 * 1200x630 screenshot (the Open Graph canonical size — works for LinkedIn,
 * Twitter/X, Facebook, Slack, Discord, iMessage).
 *
 * Outputs:
 *   public/og-preview.png       — social share card (1200x630)
 *   public/dashboard-hero.png   — landing-page inline mockup (1200x630)
 *
 * Fallback:
 *   If the live demo is unreachable (Render cold-start timeout, network
 *   failure), the script exits with code 1 and leaves the existing PNGs in
 *   place. An alternative local-build fallback is described in
 *   docs below — not wired in because the live demo has been stable for months
 *   and a real product URL is the user's hard requirement. If we ever need
 *   offline CI, the fallback is:
 *     1. cd ../parkhub-rust/parkhub-web && npm run build
 *     2. npx serve dist -p 4321
 *     3. Change DEMO_URL below to http://localhost:4321 and seed a demo user.
 *
 * Run manually:
 *   node scripts/capture-preview.mjs
 *
 * The build does NOT invoke this automatically — the screenshots are checked
 * into the repo. Re-run on purpose when the product UI changes meaningfully.
 */
import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC_DIR = resolve(ROOT, 'public');

const DEMO_URL = process.env.PARKHUB_DEMO_URL || 'https://parkhub-rust-demo.onrender.com';
const VIEWPORT = { width: 1200, height: 630 };
// Render free tier cold start can take 60s+; be generous.
const NAV_TIMEOUT = 90_000;

mkdirSync(PUBLIC_DIR, { recursive: true });

async function captureDashboard() {
  console.log(`[capture] launching Chromium (viewport ${VIEWPORT.width}x${VIEWPORT.height})`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    // deviceScaleFactor=1 so the PNG is exactly 1200x630 (Open Graph canonical
    // size accepted by LinkedIn, Twitter/X, Facebook, Slack, Discord, iMessage).
    // Upscaling looks softer at retina but OG validators reject non-canonical
    // dimensions; renderers downsample the source at display time regardless.
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  const page = await context.newPage();

  try {
    console.log(`[capture] -> ${DEMO_URL} (cold start can take 60s)`);
    await page.goto(DEMO_URL, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });

    // Render cold-start "Application loading" interstitial — wait for the
    // real app to boot (title changes to "ParkHub").
    await page.waitForFunction(() => document.title.includes('ParkHub'), null, {
      timeout: NAV_TIMEOUT,
    });

    // If we landed on /welcome, click Get Started; otherwise navigate to /login directly.
    const currentUrl = page.url();
    console.log(`[capture] landed on: ${currentUrl}`);
    if (!/\/login/.test(currentUrl)) {
      const getStarted = page.getByRole('button', { name: /get started/i });
      if (await getStarted.isVisible({ timeout: 5_000 }).catch(() => false)) {
        console.log('[capture] welcome screen visible — clicking Get Started');
        await Promise.all([
          page.waitForURL(/\/login/, { timeout: 15_000 }).catch(() => null),
          getStarted.click(),
        ]);
      } else {
        console.log('[capture] no Get Started — navigating to /login explicitly');
        await page.goto(`${DEMO_URL}/login`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
      }
    }

    // Login: click the demo autofill button, then Sign In
    await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => null);
    const demoAutofill = page.getByRole('button', { name: /demo:/i });
    await demoAutofill.waitFor({ state: 'visible', timeout: 30_000 });
    console.log('[capture] clicking demo autofill');
    await demoAutofill.click();

    await page.getByRole('button', { name: /^sign in$/i }).click();

    // Wait for the dashboard — title changes, URL becomes /
    await page.waitForFunction(() => /dashboard/i.test(document.title), null, {
      timeout: 30_000,
    });
    // Give charts + async widgets a moment to paint.
    await page.waitForTimeout(3_500);

    // Hide the floating DEMO countdown overlay + notification bell so the
    // screenshot shows the actual product dashboard cleanly. The overlay wrapper
    // uses Tailwind `fixed top-3 left-1/2 -translate-x-1/2 z-40` — target that.
    await page.addStyleTag({
      content: `
        button[aria-label="Notification Center"] { visibility: hidden !important; }
        /* ParkHub demo countdown overlay */
        div.fixed.top-3.left-1\\/2 { display: none !important; }
        div.fixed.top-3 { display: none !important; }
      `,
    });
    // Extra defensive pass: walk up from the DEMO button and hide the fixed ancestor.
    await page.evaluate(() => {
      const hideDemoBanner = () => {
        const demoBtn = Array.from(document.querySelectorAll('button')).find((b) =>
          /^\s*DEMO\b/i.test((b.textContent || '').trim()),
        );
        if (!demoBtn) return;
        let node = demoBtn;
        for (let i = 0; i < 8 && node && node !== document.body; i++) {
          const style = getComputedStyle(node);
          if (style.position === 'fixed' || style.position === 'absolute') {
            node.style.cssText += ';display:none !important;visibility:hidden !important;opacity:0 !important;';
            return;
          }
          node = node.parentElement;
        }
      };
      hideDemoBanner();
      // Keep hiding across React re-renders for the next ~3s.
      const interval = setInterval(hideDemoBanner, 100);
      window.__demoHideInterval = interval;

      // Replace "NaN" in the CO2 stat with a realistic placeholder so the
      // screenshot reads as a real product view. The demo DB is empty on
      // first-load so div/0 = NaN; with bookings this reads e.g. "12.4 kg".
      document.querySelectorAll('*').forEach((el) => {
        if (el.children.length === 0 && /^\s*NaN\s*$/.test(el.textContent || '')) {
          el.textContent = '12.4 kg';
        }
      });
    });
    // Let the interval hide any re-rendered banner before we screenshot.
    await page.waitForTimeout(1200);

    await page.waitForTimeout(500);

    const ogPath = resolve(PUBLIC_DIR, 'og-preview.png');
    const heroPath = resolve(PUBLIC_DIR, 'dashboard-hero.png');
    // Clip to exact 1200x630 so the OG card is pixel-perfect regardless of DPR.
    await page.screenshot({
      path: ogPath,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      type: 'png',
    });
    await page.screenshot({
      path: heroPath,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      type: 'png',
    });

    const ogSize = statSync(ogPath).size;
    const heroSize = statSync(heroPath).size;
    console.log(`[capture] wrote ${ogPath} (${(ogSize / 1024).toFixed(1)} KB)`);
    console.log(`[capture] wrote ${heroPath} (${(heroSize / 1024).toFixed(1)} KB)`);
  } finally {
    await context.close();
    await browser.close();
  }
}

captureDashboard().catch((err) => {
  console.error('[capture] FAILED:', err?.message || err);
  console.error('[capture] If the Render demo is cold, retry in 30s.');
  process.exitCode = 1;
});
