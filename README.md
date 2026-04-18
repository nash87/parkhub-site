# parkhub-site

Marketing site for [ParkHub](https://github.com/nash87/parkhub-rust) — self-hosted parking management, available as two editions (Rust + PHP) sharing one React frontend.

Live at **<https://nash87.github.io/parkhub-site/>**.

## Structure

Static HTML/CSS/JSX, served as-is by GitHub Pages. No build step:

- `index.html` — entry point, loads React 18 UMD + Babel standalone from CDN
- `landing.jsx` — the marketing page (exported from [claude.ai/design](https://claude.ai/design) handoff bundle, 2026-04-18)
- `icons.jsx` — icon set used by the landing page
- `tokens.css` — OKLCH design tokens (light/dark × 5 use-case palettes), derived from the ParkHub repos' `DESIGN.md`

## Editing

Drop in any modern browser or run `python3 -m http.server` in the repo root, then open <http://localhost:8000/>. Edits to `landing.jsx` are picked up on refresh — the browser compiles JSX at view time via Babel standalone.

## Deployment

GitHub Pages, served from `main` branch root. Pushes to `main` auto-deploy via the default Pages publisher (no Actions workflow needed).

## Relationship to other repos

- [`nash87/parkhub-rust`](https://github.com/nash87/parkhub-rust) — Rust backend (Axum + redb) + frontend + the full six-surface design at `/preview/`
- [`nash87/parkhub-php`](https://github.com/nash87/parkhub-php) — PHP backend (Laravel 13) + same frontend + same `/preview/`
- [`nash87/legal`](https://github.com/nash87/legal) — Impressum + Datenschutz (linked from footer)
- ~~`nash87/infracraft-demos`~~ — superseded by this repo; archived.

## License

MIT — see `LICENSE`.
