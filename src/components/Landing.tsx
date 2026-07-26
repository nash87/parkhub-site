import { Icon } from './Icons';
import type { ReactNode } from 'react';

const APP_VERSION = (import.meta.env?.VITE_APP_VERSION as string | undefined) ?? '4.14.2';

const BASE = import.meta.env?.BASE_URL ?? '/';
const asset = (p: string) => `${BASE.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;

const repoLinks = {
  rust: 'https://github.com/nash87/parkhub-rust',
  php: 'https://github.com/nash87/parkhub-php',
  site: 'https://github.com/nash87/parkhub-site',
  demo: 'https://parkhub-rust-demo.onrender.com',
};

function ParkHubLogo() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <Icon name="car-simple" size={17} weight={2.2} />
    </div>
  );
}

function SectionHeading({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <div className="section-head">
      <span className="rule-gold" aria-hidden="true" />
      <p className="section-label">{label}</p>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export function Landing() {
  const capabilities = [
    ['Bookings', 'Recurring reservations, guest passes, swaps, waitlists, and QR check-in.'],
    ['Identity', 'Role-based access, passkeys, TOTP, SSO profiles, and admin session controls.'],
    ['Operations', 'Occupancy metrics, CSV exports, webhook delivery, iCal sync, and audit logs.'],
    ['Legal tools', 'GDPR export and erasure workflows are built in; production legal templates still need operator review.'],
  ];

  const editions = [
    {
      title: 'Rust edition.',
      body: 'Run one Axum binary with an embedded redb store. It is the smallest operational shape for teams that control their own server.',
      link: repoLinks.rust,
      linkText: 'Open Rust repo',
    },
    {
      title: 'PHP edition.',
      body: 'Run Laravel on the stack many parking operators already know. Same React v5 surface, same product vocabulary.',
      link: repoLinks.php,
      linkText: 'Open PHP repo',
    },
    {
      title: 'One frontend contract.',
      body: 'Both editions share the same dense React dashboard, the same design-v5 navigation model, and the same release evidence bar.',
      link: `${repoLinks.rust}/tree/main/parkhub-web`,
      linkText: 'Inspect the UI',
    },
    {
      title: 'Honest release boundary.',
      body: 'ParkHub does not claim a hosted control plane. Public launch waits for local gates, GitHub checks, attestations, screenshots, and operator approval.',
      link: repoLinks.site,
      linkText: 'Read the site source',
    },
  ];

  return (
    <div className="site-shell">
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="ParkHub home">
          <ParkHubLogo />
          <span>ParkHub</span>
          <span className="build-pill">v{APP_VERSION}</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#editions">Editions</a>
          <a href="#capabilities">Capabilities</a>
          <a href={repoLinks.rust}>Docs</a>
        </nav>
        <a className="button button-quiet" href={repoLinks.rust}>
          <Icon name="github" size={15} />
          GitHub
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="section-label">Self-hosted parking management</p>
            <h1 id="hero-title" className="hero-display">
              ParkHub runs parking <em>without</em> a SaaS control plane.
            </h1>
            <p className="hero-lede">
              Two open-source editions: Rust for the smallest operations footprint, PHP for Laravel teams and shared hosting.
              Both keep the same React dashboard, booking model, and release evidence trail.
            </p>
            <nav className="hero-actions" aria-label="Primary actions">
              <a className="button button-primary" href={repoLinks.demo}>
                <Icon name="rocket" size={16} />
                Try the Rust demo
              </a>
              <a className="button button-secondary" href={`${repoLinks.rust}#installation`}>
                <Icon name="download" size={16} />
                Install from source
              </a>
            </nav>
            <dl className="proof-strip" aria-label="ParkHub release facts">
              <div>
                <dt>License</dt>
                <dd>MIT</dd>
              </div>
              <div>
                <dt>Surfaces</dt>
                <dd>Rust + PHP</dd>
              </div>
              <div>
                <dt>UI</dt>
                <dd>React v5</dd>
              </div>
              <div>
                <dt>Evidence</dt>
                <dd>CI first</dd>
              </div>
            </dl>
          </div>

          <figure className="hero-media">
            <div className="browser-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <code>parkhub dashboard</code>
            </div>
            <img
              src={asset('/dashboard-hero.png')}
              alt="ParkHub dashboard showing booking statistics, usage charts, parking activity, and administrative controls."
              width={1200}
              height={630}
              loading="eager"
              decoding="async"
            />
          </figure>
        </section>

        <section id="editions" className="section-band">
          <SectionHeading label="Choose the shape" title="One product, two operational contracts.">
            ParkHub is not split into a marketing edition and a real edition. The Rust and PHP repositories carry the same product surface.
          </SectionHeading>

          <ol className="manifesto">
            {editions.map((edition) => (
              <li key={edition.title}>
                <strong>{edition.title}</strong>
                <p>{edition.body}</p>
                <a href={edition.link}>
                  {edition.linkText}
                  <Icon name="arrow" size={14} />
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section id="capabilities" className="section-band section-band-alt">
          <SectionHeading label="Operational ledger" title="What ships in the application.">
            The public site stays tied to things present in the repositories, not launch copy that outruns the product.
          </SectionHeading>

          <div className="ledger" role="list">
            {capabilities.map(([name, text]) => (
              <div className="ledger-row" role="listitem" key={name}>
                <div className="ledger-name">
                  <Icon name={name === 'Bookings' ? 'calendar-check' : name === 'Identity' ? 'key' : name === 'Operations' ? 'chart-line' : 'shield'} size={18} />
                  <span>{name}</span>
                </div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-band">
          <SectionHeading label="Release discipline" title="Public means proven.">
            The GitHub Pages site should be the last mile of the release train, not the evidence source.
          </SectionHeading>

          <ol className="release-flow" role="list">
            {['Source proof', 'Local gates', 'GitHub checks', 'Screenshots', 'Public deploy'].map((step, index) => (
              <li key={step} className="release-step">
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="colophon" aria-label="Colophon">
          <p>ParkHub is for operators who would rather own the boring parking system than rent the polished control panel.</p>
          <span className="build-stamp">parkhub-site / v{APP_VERSION} / GitHub Pages source-ready</span>
          <span className="colophon-platform">Built on the <a href="https://securanido.com">Securanido platform</a>.</span>
        </section>
      </main>

      <footer className="site-footer">
        <span>2026 ParkHub / MIT License</span>
        <nav aria-label="Legal and source links">
          <a href="https://nash87.github.io/legal/impressum">Impressum</a>
          <a href="https://nash87.github.io/legal/datenschutz">Datenschutz</a>
          <a href={repoLinks.site}>Source</a>
        </nav>
      </footer>
    </div>
  );
}
