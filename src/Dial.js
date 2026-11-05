import React from "react";

const SIZE = 240;
const C = SIZE / 2;
const R = 96;
const SWEEP = 270; // degrees of arc the gauge covers
const START = 135; // degrees, measured clockwise from three o'clock

const point = (deg, radius) => {
  const rad = (deg * Math.PI) / 180;
  return [C + radius * Math.cos(rad), C + radius * Math.sin(rad)];
};

// A 270° gauge for the CGPA, with a tick at each degree-class boundary.
export default function Dial({ value, max, classes, label }) {
  const circumference = 2 * Math.PI * R;
  const arc = (circumference * SWEEP) / 360;
  const filled = arc * Math.min(Math.max(value / max, 0), 1);

  return (
    <div className="dial" role="img" aria-label={`CGPA ${value.toFixed(2)} out of ${max}, ${label}`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <defs>
          <linearGradient id="dial-fill" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#ff9f5a" />
            <stop offset="1" stopColor="#f6b93b" />
          </linearGradient>
        </defs>
        <circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="rgba(183,163,255,0.16)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          transform={`rotate(${START} ${C} ${C})`}
        />
        <circle
          className="dial-value"
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="url(#dial-fill)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          transform={`rotate(${START} ${C} ${C})`}
        />
        {classes.map(([min, name]) => {
          const deg = START + (SWEEP * min) / max;
          const [x1, y1] = point(deg, R + 13);
          const [x2, y2] = point(deg, R + 22);
          return (
            <line
              key={name}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={value >= min ? "#f6b93b" : "rgba(183,163,255,0.45)"}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="dial-readout">
        <span className="dial-number">{value.toFixed(2)}</span>
        <span className="dial-max">out of {max.toFixed(1)}</span>
      </div>
    </div>
  );
}
