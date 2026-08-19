/**
 * Accessibility and layout guard for the marketing page.
 *
 * Checks the things that are cheap to measure and expensive to notice by
 * eye: horizontal overflow, heading order, landmarks, accessible names,
 * link safety, and WCAG 2.2 SC 2.5.8 target sizes.
 *
 * Usage:
 *   npm run preview &            # or any server for the built site
 *   npm run audit:a11y
 *
 * Override the target with AUDIT_URL.
 */
import { chromium } from 'playwright';

const URL = process.env.AUDIT_URL ?? 'http://localhost:4321/parkhub-site/';

/** SC 2.5.8 minimum target size, in CSS pixels. */
const MIN_TARGET_PX = 24;

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

const failures = [];
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  const r = await page.evaluate((minTarget) => {
    const de = document.documentElement;
    const text = (el) => (el.textContent || '').trim();
    const accessibleName = (el) => text(el) || el.getAttribute('aria-label') || el.getAttribute('title');

    // SC 2.5.8 exempts targets rendered within a line of text. A link whose
    // parent holds prose around it is inline; a link that is its own block
    // (nav item, list action) is not.
    const isInlineInSentence = (el) => {
      const parent = el.parentElement;
      if (!parent) return false;
      const parentText = text(parent);
      const own = text(el);
      return parentText.length > own.length + 1 && getComputedStyle(el).display.startsWith('inline');
    };

    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);

    return {
      overflowPx: de.scrollWidth - de.clientWidth,
      h1Count: headings.filter((l) => l === 1).length,
      headingSkips: headings.filter((lv, i) => i > 0 && lv - headings[i - 1] > 1).length,
      missingLandmarks: ['header', 'nav', 'main', 'footer'].filter((t) => !document.querySelector(t)),
      unnamed: [...document.querySelectorAll('a,button')]
        .filter((el) => !accessibleName(el))
        .map((el) => el.outerHTML.slice(0, 80)),
      imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
      unsafeBlank: [...document.querySelectorAll('a[target="_blank"]')]
        .filter((a) => !(a.rel || '').includes('noopener')).length,
      insecure: [...document.querySelectorAll('a[href^="http:"]')].length,
      deadAnchors: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && h.length > 1 && !document.querySelector(h)),
      smallTargets: [...document.querySelectorAll('a,button')]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0) return false;
          if (rect.height >= minTarget && rect.width >= minTarget) return false;
          return !isInlineInSentence(el);
        })
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return `${text(el).slice(0, 30)} (${Math.round(rect.width)}x${Math.round(rect.height)})`;
        }),
    };
  }, MIN_TARGET_PX);

  const problems = [];
  if (r.overflowPx > 0) problems.push(`horizontal overflow ${r.overflowPx}px`);
  if (r.h1Count !== 1) problems.push(`${r.h1Count} <h1> elements (expected exactly 1)`);
  if (r.headingSkips > 0) problems.push(`${r.headingSkips} heading-level skip(s)`);
  if (r.missingLandmarks.length) problems.push(`missing landmark(s): ${r.missingLandmarks.join(', ')}`);
  if (r.unnamed.length) problems.push(`${r.unnamed.length} control(s) with no accessible name: ${r.unnamed.join(' ')}`);
  if (r.imgsNoAlt) problems.push(`${r.imgsNoAlt} image(s) without alt`);
  if (r.unsafeBlank) problems.push(`${r.unsafeBlank} target=_blank link(s) without rel=noopener`);
  if (r.insecure) problems.push(`${r.insecure} plain-http link(s)`);
  if (r.deadAnchors.length) problems.push(`dead in-page anchor(s): ${r.deadAnchors.join(', ')}`);
  if (r.smallTargets.length) {
    problems.push(`${r.smallTargets.length} target(s) below ${MIN_TARGET_PX}px: ${r.smallTargets.join(' | ')}`);
  }

  if (problems.length) {
    failures.push(`${vp.name} (${vp.width}px):\n  - ${problems.join('\n  - ')}`);
    console.error(`✗ ${vp.name} (${vp.width}px)\n  - ${problems.join('\n  - ')}`);
  } else {
    console.log(`✓ ${vp.name} (${vp.width}px)`);
  }

  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} viewport(s) failed the accessibility guard.`);
  process.exit(1);
}
console.log('\nAll viewports pass the accessibility guard.');
