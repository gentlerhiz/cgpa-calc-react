import React from "react";

// Mortarboard with a swinging tassel, used as the logo mark.
export function CapMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 8 3 18l21 10 21-10L24 8Z" fill="var(--gold)" />
      <path d="M12 23v9c0 3 5.4 6 12 6s12-3 12-6v-9l-12 5.7L12 23Z" fill="var(--lilac)" />
      <path d="M42 19.5V31" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="42" cy="33" r="2.6" fill="var(--gold)" />
    </svg>
  );
}

// An empty result slip with a pencil, for when a semester has no courses yet.
export function EmptySlip() {
  return (
    <svg width="168" height="128" viewBox="0 0 168 128" aria-hidden="true">
      <ellipse cx="84" cy="118" rx="62" ry="7" fill="#e3d9fb" />
      <rect x="34" y="10" width="92" height="104" rx="10" fill="#fff" stroke="#d9cdf8" strokeWidth="2" />
      <rect x="48" y="26" width="40" height="8" rx="4" fill="#b7a3ff" />
      {[46, 62, 78, 94].map((y) => (
        <g key={y}>
          <rect x="48" y={y} width="34" height="6" rx="3" fill="#ece6fb" />
          <rect x="92" y={y} width="20" height="6" rx="3" fill="#ece6fb" />
        </g>
      ))}
      <g transform="rotate(35 128 70)">
        <rect x="120" y="30" width="14" height="64" rx="3" fill="#f6b93b" />
        <rect x="120" y="30" width="14" height="10" rx="3" fill="#ff7a66" />
        <path d="M120 94h14l-7 14-7-14Z" fill="#f3dfb6" />
        <path d="M124.5 103h5l-2.5 5-2.5-5Z" fill="#23163f" />
      </g>
    </svg>
  );
}
