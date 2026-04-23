# parkhub-site

Marketing site for [ParkHub](https://github.com/nash87/parkhub-rust) — self-hosted parking management, available as two editions (Rust + PHP) sharing one React frontend.

Live at **<https://nash87.github.io/parkhub-site/>**.

## Stack

- **Astro 6** — static site generator, builds to plain HTML
- **React 19** — landing page is a single React component (`src/components/Landing.tsx`)
- **Tailwind 4** design tokens via `src/styles/tokens.css` (OKLCH light/dark × use-case palettes), derived from the ParkHub repos' `DESIGN.md`
- **Playwright** — used by `scripts/capture-preview.mjs` to refresh the OG preview image
- **Node ≥ 22.12.0**

## Layout

```
src/
├── pages/index.astro      # entry — sets up <head>, mounts <Landing/>
├── components/
│   ├── Landing.tsx        # the marketing page
│   └── Icons.tsx          # icon set
└── styles/tokens.css      # OKLCH design tokens

public/
├── dashboard-hero.png     # hero screenshot
└── og-preview.png         # OpenGraph preview (regenerated via npm run capture)

scripts/
└── capture-preview.mjs    # Playwright script to refresh og-preview.png
```

The app version shown in the hero badge is injected at build time from `../parkhub-rust/Cargo.toml` via `astro.config.mjs`. Falls back to a pinned default when the Cargo manifest isn't reachable (e.g. type-checking outside the build graph).

## Develop

```bash
npm install
npm run dev          # astro dev — http://localhost:4321/parkhub-site/
npm run check        # astro check — TS + Astro diagnostics
npm run lint         # tsc --noEmit
npm run build        # astro build → ./dist/
npm run preview      # serve the production build locally
npm run capture      # regenerate public/og-preview.png via Playwright
```

## Deploy

GitHub Pages, served from `main` branch via Astro's static output. Pushes to `main` auto-deploy through the workflow in `.github/workflows/`.

## Related repos

- [`nash87/parkhub-rust`](https://github.com/nash87/parkhub-rust) — Rust backend (Axum) + frontend + the full six-surface design at `/preview/`
- [`nash87/parkhub-php`](https://github.com/nash87/parkhub-php) — PHP backend (Laravel 13 + PHP 8.4) + same frontend + same `/preview/`
- [`nash87/legal`](https://github.com/nash87/legal) — Impressum + Datenschutz (linked from footer)
- ~~[`nash87/infracraft-demos`](https://github.com/nash87/infracraft-demos)~~ — superseded by this repo; archived.

## License

MIT — see `LICENSE`.
