# parkhub-site

Marketing site for [ParkHub](https://github.com/nash87/parkhub-rust): self-hosted parking management, available as two editions (Rust + PHP) sharing one React frontend.

Live at **<https://nash87.github.io/parkhub-site/>**.

## Stack

- **Astro 7** — static site generator, builds to plain HTML
- **React 19** — landing page is a single React component (`src/components/Landing.tsx`)
- **Warm Securanido tokens** via `src/styles/tokens.css`, derived from the ParkHub repos' `DESIGN.md`
- **Playwright** — used by `scripts/capture-preview.mjs` to refresh the OG preview image
- **Node ≥ 22.12.0**

## Develop

```bash
npm install
npm run dev          # astro dev server for local preview
npm run check        # astro check — TS + Astro diagnostics
npm run lint         # tsc --noEmit
npm run build        # astro build → ./dist/
npm run preview      # serve the production build locally
npm run capture      # regenerate public/og-preview.png via Playwright
```

## Deploy

GitHub Pages, served from `main` branch via Astro's static output. Pushes to `main` auto-deploy through the workflow in `.github/workflows/`.

## Related repos

Part of the ParkHub project:

- [`nash87/parkhub-rust`](https://github.com/nash87/parkhub-rust) — Rust backend (Axum) + frontend + the full six-surface design at `/preview/`
- [`nash87/parkhub-php`](https://github.com/nash87/parkhub-php) — PHP backend (Laravel 13 + PHP 8.4) + same frontend + same `/preview/`
- [`nash87/legal`](https://github.com/nash87/legal) — Impressum + Datenschutz (linked from footer)

## License

MIT — see `LICENSE`.
