// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

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
});
