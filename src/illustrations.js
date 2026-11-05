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

// A large mortarboard with a tassel and sparkles, for the hero and closing band.
export function HeroCap({ className }) {
  return (
    <svg className={className} viewBox="0 0 220 180" aria-hidden="true">
      <defs>
        <linearGradient id="cap-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4b2aa8" />
          <stop offset="1" stopColor="#2a1660" />
        </linearGradient>
        <linearGradient id="cap-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2180" />
          <stop offset="1" stopColor="#1f1048" />
        </linearGradient>
      </defs>
      <path d="M56 86v34c0 14 24 26 54 26s54-12 54-26V86l-54 24-54-24Z" fill="url(#cap-base)" />
      <path d="M110 30 14 74l96 44 96-44-96-44Z" fill="url(#cap-top)" stroke="#b7a3ff" strokeOpacity=".5" strokeWidth="2" />
      <path d="M110 74c-6 0-10 2-10 4s4 4 10 4 10-2 10-4-4-4-10-4Z" fill="#f6b93b" />
      <path d="M110 78 186 90v40" fill="none" stroke="#f6b93b" strokeWidth="4" strokeLinecap="round" />
      <path d="M178 128h16l-3 26h-10l-3-26Z" fill="#f6b93b" />
      <path d="M181 154h10" stroke="#e0951a" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 28l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill="#f6b93b" />
      <path d="M196 32l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#b7a3ff" />
      <circle cx="24" cy="120" r="4" fill="#3fd0a0" />
    </svg>
  );
}

// A stack of three textbooks.
export function BookStack({ className }) {
  return (
    <svg className={className} viewBox="0 0 160 120" aria-hidden="true">
      <rect x="18" y="80" width="124" height="26" rx="6" fill="#3fd0a0" />
      <rect x="18" y="80" width="14" height="26" rx="4" fill="#2aa57d" />
      <rect x="40" y="90" width="80" height="4" rx="2" fill="#b9f2de" />
      <rect x="30" y="54" width="108" height="26" rx="6" fill="#b7a3ff" />
      <rect x="124" y="54" width="14" height="26" rx="4" fill="#8f78e8" />
      <rect x="44" y="64" width="64" height="4" rx="2" fill="#e8e0ff" />
      <rect x="24" y="30" width="112" height="24" rx="6" fill="#f6b93b" transform="rotate(-6 80 42)" />
      <rect x="40" y="38" width="60" height="4" rx="2" fill="#fde7b5" transform="rotate(-6 80 42)" />
      <path d="M100 28c8-14 22-18 30-14-6 2-10 8-12 16" fill="#ff7a66" />
    </svg>
  );
}
