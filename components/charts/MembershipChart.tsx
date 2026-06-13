"use client";

import { membershipOf } from "@/lib/fuzzy/membership";
import { risikoVariable } from "@/lib/fuzzy/rules";
import type { FuzzyLabel, MembershipDegrees } from "@/lib/fuzzy/types";

/**
 * Grafik membership function himpunan output Risiko (PRD 5 / 4.5).
 * Grid & label tegas, penanda skor, legend dengan derajat aktivasi α (eksplisit).
 */
interface MembershipChartProps {
  value: number;
  /** Derajat aktivasi (α) hasil agregasi per himpunan output — ditampilkan eksplisit. */
  aggregated?: MembershipDegrees;
}

const W = 360;
const H = 190;
const PAD = { top: 14, right: 14, bottom: 30, left: 34 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const RANGE_MIN = risikoVariable.range[0];
const RANGE_MAX = risikoVariable.range[1];

const COLORS: Record<FuzzyLabel, string> = {
  Rendah: "var(--risk-rendah)",
  Sedang: "var(--risk-sedang)",
  Tinggi: "var(--risk-tinggi)",
};

const toX = (v: number) =>
  PAD.left + ((v - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * PLOT_W;
const toY = (mu: number) => PAD.top + (1 - mu) * PLOT_H;

function buildPoints(set: (typeof risikoVariable.sets)[number]): string {
  const pts: string[] = [];
  for (let v = RANGE_MIN; v <= RANGE_MAX; v += 1) {
    pts.push(`${toX(v).toFixed(1)},${toY(membershipOf(v, set)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function MembershipChart({
  value,
  aggregated,
}: MembershipChartProps) {
  const clamped = Math.max(RANGE_MIN, Math.min(RANGE_MAX, value));
  const markerX = toX(clamped);
  const xTicks = [0, 25, 50, 75, 100];
  const yTicks = [0, 0.5, 1];

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Fungsi keanggotaan risiko, penanda pada skor ${Math.round(clamped)}`}
      >
        {/* Grid Y + label μ */}
        {yTicks.map((mu) => (
          <g key={mu}>
            <line
              x1={PAD.left}
              y1={toY(mu)}
              x2={W - PAD.right}
              y2={toY(mu)}
              stroke="var(--border)"
              strokeWidth={mu === 0 ? 1.5 : 1}
            />
            <text
              x={PAD.left - 6}
              y={toY(mu) + 3}
              fill="var(--text-muted)"
              fontSize={8}
              textAnchor="end"
              className="font-mono"
            >
              {mu.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Grid X + label */}
        {xTicks.map((t) => (
          <g key={t}>
            <line
              x1={toX(t)}
              y1={PAD.top}
              x2={toX(t)}
              y2={H - PAD.bottom}
              stroke="var(--border)"
              strokeWidth={0.5}
              opacity={0.5}
            />
            <text
              x={toX(t)}
              y={H - PAD.bottom + 14}
              fill="var(--text-muted)"
              fontSize={8}
              textAnchor="middle"
              className="font-mono"
            >
              {t}
            </text>
          </g>
        ))}
        <text
          x={W - PAD.right}
          y={H - 4}
          fill="var(--text-muted)"
          fontSize={8}
          textAnchor="end"
          className="font-mono"
          letterSpacing="1"
        >
          RISIKO →
        </text>

        {/* Kurva himpunan */}
        {risikoVariable.sets.map((set) => (
          <polyline
            key={set.label}
            points={buildPoints(set)}
            fill="none"
            stroke={COLORS[set.label]}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ))}

        {/* Penanda skor */}
        <line
          x1={markerX}
          y1={PAD.top - 2}
          x2={markerX}
          y2={H - PAD.bottom}
          stroke="var(--text-primary)"
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />
        <rect
          x={markerX - 11}
          y={PAD.top - 12}
          width={22}
          height={11}
          fill="var(--text-primary)"
        />
        <text
          x={markerX}
          y={PAD.top - 3.5}
          fill="var(--bg-base)"
          fontSize={8}
          textAnchor="middle"
          className="stat-num"
        >
          {Math.round(clamped)}
        </text>
      </svg>

      {/* Legend + derajat aktivasi α (data eksplisit) */}
      <div className="mt-3 grid grid-cols-3 border border-border-default">
        {risikoVariable.sets.map((set, i) => (
          <div
            key={set.label}
            className={`px-3 py-2 ${i > 0 ? "border-l border-border-default" : ""}`}
          >
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[set.label] }}
              />
              <span className="text-xs text-text-secondary">{set.label}</span>
            </div>
            {aggregated && (
              <p className="stat-num mt-1 text-sm text-text-primary">
                α {aggregated[set.label].toFixed(2)}
              </p>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}
