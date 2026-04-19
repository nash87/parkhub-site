// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { readFileSync } from 'node:fs';

// Pull the workspace version from the neighbouring parkhub-rust Cargo.toml so
// the landing-page badge stays in sync with every release tag. Mirrors the
// pattern in parkhub-rust/parkhub-web/astro.config.mjs. Falls back to a pinned
// default when the Cargo manifest isn't reachable (e.g. GitHub Pages CI builds
// that only clone parkhub-site).
const FALLBACK_VERSION = '4.14.2';
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
  vite: {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
    },
  },
});
