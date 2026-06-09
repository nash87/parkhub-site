# Contributing to parkhub-site

This is the static marketing site for [ParkHub](https://github.com/nash87/parkhub-rust).
It is built with [Astro](https://astro.build) and React 19.

---

## What belongs here

- Copy, layout, and design changes to the landing page (`src/components/Landing.tsx`)
- Additions to the design token file (`src/styles/tokens.css`)
- OG/meta tag updates (`src/pages/index.astro`)
- Public assets: screenshots, logos, fonts (`public/`)

Changes to ParkHub itself — features, bug fixes, API — belong in
[parkhub-rust](https://github.com/nash87/parkhub-rust) or
[parkhub-php](https://github.com/nash87/parkhub-php).

---

## Local development

```sh
npm install
npm run dev      # starts Astro dev server at http://localhost:4321/parkhub-site/
```

The site reads `../parkhub-rust/Cargo.toml` at build time to show the current
version badge. If that file is not present (typical for a checkout of this repo
alone), the `FALLBACK_VERSION` constant in `astro.config.mjs` is used instead.
Keep it in sync with the latest Rust release when bumping.

---

## Opening a pull request

1. Fork the repo and create a branch (`git checkout -b fix/my-change`).
2. Make your changes and verify the site builds (`npm run build`).
3. Open a PR against `main`. Include a brief description and, if the change is
   visual, a screenshot or the GitHub Pages preview URL.
4. The deploy workflow will run a TypeScript check and Astro build automatically.

Keep PRs focused. One logical change per PR is easier to review and revert.

---

## Code of conduct

This project follows the
[Contributor Covenant 2.1](CODE_OF_CONDUCT.md). Be respectful and constructive.

---

## Security

Report security issues via the
[private advisory channel](SECURITY.md), not as public issues.
