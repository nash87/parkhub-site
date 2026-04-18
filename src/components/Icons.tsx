// Phosphor-style line icons. Only the ones we need. 20px viewBox-aware.
// Usage: <Icon name="car" size={16} />
//
// Ported from the claude.ai/design handoff bundle's icons.jsx (2026-04-18)
// into TSX so Astro's React integration builds it natively under React 19.

import type { CSSProperties, ReactNode } from 'react';

const ICONS: Record<string, ReactNode> = {
  car: <><path d="M4 17h16M6 17v-5l2-5h8l2 5v5M6 12h12M8 17v2M16 17v2M8 14a1 1 0 100-2 1 1 0 000 2zM16 14a1 1 0 100-2 1 1 0 000 2z"/></>,
  'car-simple': <><rect x="3" y="10" width="18" height="8" rx="2"/><path d="M6 10l2-5h8l2 5M7 18v1.5M17 18v1.5"/></>,
  home: <><path d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V10z"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
  'calendar-check': <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4M8 14l3 3 5-5"/></>,
  'calendar-plus': <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4M12 12v6M9 15h6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  coins: <><circle cx="9" cy="9" r="6"/><circle cx="15" cy="15" r="6"/></>,
  'map-pin': <><path d="M12 22s-7-7-7-12a7 7 0 1114 0c0 5-7 12-7 12z"/><circle cx="12" cy="10" r="3"/></>,
  check: <><path d="M5 12l5 5L20 7"/></>,
  x: <><path d="M5 5l14 14M19 5L5 19"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  back: <><path d="M19 12H5M11 6l-6 6 6 6"/></>,
  chevron: <><path d="M9 6l6 6-6 6"/></>,
  list: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></>,
  bell: <><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 004 0"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
  users: <><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7M16 3.5a4 4 0 010 7.5M22 21c0-3.5-2.5-6.3-6-6.9"/></>,
  qr: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 17v4"/></>,
  lightning: <><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></>,
  leaf: <><path d="M11 20A7 7 0 014 13V5h8a7 7 0 017 7v1a7 7 0 01-8 7zM5 19l14-14"/></>,
  star: <><path d="M12 3l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.9l-5.8 3.05 1.1-6.5L2.6 9.85l6.5-.95L12 3z"/></>,
  trend: <><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></>,
  gauge: <><path d="M12 14l5-5M3 12a9 9 0 0118 0v7H3v-7z"/></>,
  wrench: <><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.9-.1-.1-2.9 2.5-2.5z"/></>,
  'chart-line': <><path d="M3 3v18h18M7 15l4-4 3 3 6-6"/></>,
  'chart-bar': <><path d="M3 3v18h18M7 17v-6M12 17V8M17 17v-4"/></>,
  key: <><circle cx="8" cy="12" r="4"/><path d="M12 12h9l-2 2M17 12l2 2"/></>,
  shield: <><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></>,
  grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  moon: <><path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  sparkle: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6L19 14z"/></>,
  download: <><path d="M12 3v13M6 12l6 6 6-6M4 21h16"/></>,
  external: <><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M14 3h7v7M10 14L21 3"/></>,
  github: <><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></>,
  filter: <><path d="M3 4h18l-7 10v6l-4-2v-4L3 4z"/></>,
  edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash: <><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
  swap: <><path d="M7 16V4l-4 4M3 8l4-4M17 8v12l4-4M21 16l-4 4"/></>,
  code: <><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></>,
  rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>,
  server: <><rect x="3" y="3" width="18" height="8" rx="1"/><rect x="3" y="13" width="18" height="8" rx="1"/><path d="M7 7h.01M7 17h.01"/></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/></>,
  flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></>,
};

interface IconProps {
  name: string;
  size?: number;
  weight?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 18, weight = 1.75, className = '', style }: IconProps) {
  const ic = ICONS[name];
  if (!ic) {
    return (
      <span style={{ width: size, height: size, display: 'inline-block', border: '1px dashed currentColor', opacity: 0.4, fontSize: 10, textAlign: 'center' }}>
        ?
      </span>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {ic}
    </svg>
  );
}
