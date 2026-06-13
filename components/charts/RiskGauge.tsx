"use client";

import { useEffect, useState } from "react";

/**
 * Gauge risiko setengah lingkaran 0–100 — gaya teknis & rata (tanpa gradient).
 * Zona warna kategori + tick batas eksplisit (0/40/65/100) + jarum beranimasi.
 */
interface RiskGaugeProps {
  value: number;
  /** Warna aksen (mengikuti kategori) untuk jarum & readout. */
  accent?: string;
}

const CX = 100;
const CY = 100;
const R = 78;

function valueToAngle(v: number): number {
  return 180 - (v / 100) * 180;
}

function polar(angleDeg: number, r = R): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}

function arc(a: number, b: number): string {
  const s = polar(valueToAngle(a));
  const e = polar(valueToAngle(b));
  return `M ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${e.x} ${e.y}`;
}

const ZONES = [
  { from: 0, to: 40, color: "var(--risk-rendah)" },
  { from: 40, to: 65, color: "var(--risk-sedang)" },
  { from: 65, to: 100, color: "var(--risk-tinggi)" },
];
const TICKS = [0, 40, 65, 100];

export default function RiskGauge({ value, accent = "var(--accent)" }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  const needleRotation = 1.8 * animated - 90;

  return (
    <svg
      viewBox="0 0 200 128"
      className="h-auto w-full"
      role="img"
      aria-label={`Gauge risiko: skor ${Math.round(clamped)} dari 100`}
    >
      {/* Track */}
      <path d={arc(0, 100)} fill="none" stroke="var(--border)" strokeWidth={10} />
      {/* Zona kategori (flat) */}
      {ZONES.map((z) => (
        <path
          key={z.from}
          d={arc(z.from, z.to)}
          fill="none"
          stroke={z.color}
          strokeWidth={10}
        />
      ))}

      {/* Tick batas + label */}
      {TICKS.map((t) => {
        const outer = polar(valueToAngle(t), R + 6);
        const inner = polar(valueToAngle(t), R - 6);
        const lbl = polar(valueToAngle(t), R + 14);
        return (
          <g key={t}>
            <line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--text-muted)"
              strokeWidth={1}
            />
            <text
              x={lbl.x}
              y={lbl.y + 3}
              fill="var(--text-muted)"
              fontSize={7}
              textAnchor="middle"
              className="font-mono"
            >
              {t}
            </text>
          </g>
        );
      })}

      {/* Jarum */}
      <g
        style={{
          transform: `rotate(${needleRotation}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <line x1={CX} y1={CY} x2={CX} y2={CY - R + 14} stroke={accent} strokeWidth={2.5} />
      </g>
      <circle cx={CX} cy={CY} r={4} fill={accent} />

      {/* Readout angka di tengah */}
      <text
        x={CX}
        y={CY - 8}
        fill={accent}
        fontSize={30}
        textAnchor="middle"
        className="stat-num"
      >
        {Math.round(clamped)}
      </text>
      <text
        x={CX}
        y={CY + 4}
        fill="var(--text-muted)"
        fontSize={7}
        textAnchor="middle"
        className="font-mono"
        letterSpacing="1.5"
      >
        SKOR / 100
      </text>
    </svg>
  );
}
