// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import { readFileSync } from 'node:fs';

// Pull the workspace version from the neighbouring parkhub-rust Cargo.toml so
// the landing-page badge stays in sync with every release tag. Falls back to a
// pinned default when the Cargo manifest isn't reachable (e.g. GitHub Pages CI
// builds that only clone parkhub-site). Bump FALLBACK_VERSION after each
// parkhub-rust release.
const FALLBACK_VERSION = '5.1.0';
const appVersion = (() => {
  try {
    const cargo = readFileSync(
      new URL('../parkhub-rust/Cargo.toml', import.meta.url),
      'utf8',
    );
    const m = cargo.match(/^version\s*=\s*"([^"]+)"/m);
    if (m) return m[1];
  } catch {
    /* fall through */
  }
  return FALLBACK_VERSION;
})();

// Deployed to https://nash87.github.io/parkhub-site/ — the GitHub Pages
// path requires a sub-path `base` so all generated asset URLs resolve.
export default defineConfig({
  site: 'https://nash87.github.io',
  base: '/parkhub-site',
  integrations: [react()],
  output: 'static',
  build: {
    assets: '_astro',
  },
  // Self-host Inter at build time via Astro's font optimization.
  // Astro downloads the font from Google Fonts once during `astro build`
  // and emits it as a local asset — no Google Fonts request reaches the user.
  // This removes the GDPR concern from the CDN link that was previously in
  // src/pages/index.astro.
  // Astro 6 stabilized the fonts API: top-level `fonts`, not
  // `experimental.fonts` (the experimental key fails the whole build).
  // Pages must render <Font cssVariable="..." /> from astro:assets to emit
  // the @font-face CSS + preload links.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      display: 'swap',
    },
  ],
  vite: {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
    },
  },
});
