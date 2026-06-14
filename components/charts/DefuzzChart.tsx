"use client";

import { membershipOf } from "@/lib/fuzzy/membership";
import { risikoVariable } from "@/lib/fuzzy/rules";
import type { FuzzyLabel, MembershipDegrees } from "@/lib/fuzzy/types";

/**
 * Chart defuzzifikasi (Tahap 4): kurva himpunan output Risiko (samar) +
 * AREA hasil agregasi (alpha-cut digabung MAX) yang diarsir, serta garis
 * centroid z* yang ditandai. Palet Blue Lagoon.
 */
interface DefuzzChartProps {
  /** α maksimum per himpunan output (hasil agregasi). */
  aggregated: MembershipDegrees;
  /** Titik centroid z*. */
  centroid: number;
}

const W = 420;
const H = 210;
const PAD = { top: 16, right: 16, bottom: 30, left: 34 };
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

/** μ teragregasi di titik z: MAX_label( MIN(α_label, μ_label(z)) ). */
function aggMu(z: number, aggregated: MembershipDegrees): number {
  let mu = 0;
  for (const set of risikoVariable.sets) {
    const a = aggregated[set.label];
    if (a <= 0) continue;
    const clipped = Math.min(a, membershipOf(z, set));
    if (clipped > mu) mu = clipped;
  }
  return mu;
}

export default function DefuzzChart({ aggregated, centroid }: DefuzzChartProps) {
  const xTicks = [0, 25, 50, 75, 100];

  // Area agregasi (poligon terisi) — sampling tiap 1 unit.
  const areaPts: string[] = [`${toX(RANGE_MIN).toFixed(1)},${toY(0).toFixed(1)}`];
  for (let z = RANGE_MIN; z <= RANGE_MAX; z += 1) {
    areaPts.push(`${toX(z).toFixed(1)},${toY(aggMu(z, aggregated)).toFixed(1)}`);
  }
  areaPts.push(`${toX(RANGE_MAX).toFixed(1)},${toY(0).toFixed(1)}`);

  const buildCurve = (set: (typeof risikoVariable.sets)[number]): string => {
    const pts: string[] = [];
    for (let z = RANGE_MIN; z <= RANGE_MAX; z += 1) {
      pts.push(`${toX(z).toFixed(1)},${toY(membershipOf(z, set)).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const cx = toX(centroid);

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Fungsi keanggotaan Risiko dengan area agregasi dan centroid z* = ${centroid.toFixed(2)}`}
      >
      {/* Grid μ */}
      {[0, 0.5, 1].map((mu) => (
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
            {mu.toFixed(mu === 0 || mu === 1 ? 0 : 1)}
          </text>
        </g>
      ))}

      {/* Tick X */}
      {xTicks.map((t) => (
        <text
          key={t}
          x={toX(t)}
          y={H - PAD.bottom + 14}
          fill="var(--text-muted)"
          fontSize={8}
          textAnchor="middle"
          className="font-mono"
        >
          {t}
        </text>
      ))}
      <text
        x={W - PAD.right}
        y={H - 4}
        fill="var(--text-muted)"
        fontSize={8}
        textAnchor="end"
        className="font-mono"
        letterSpacing="0.5"
      >
        skor risiko →
      </text>

      {/* Area agregasi terisi (netral) */}
      <polygon
        points={areaPts.join(" ")}
        fill="var(--text-secondary)"
        fillOpacity={0.13}
        stroke="var(--text-secondary)"
        strokeOpacity={0.55}
        strokeWidth={1.2}
      />

      {/* Kurva 3 himpunan output (jelas) */}
      {risikoVariable.sets.map((set) => (
        <polyline
          key={set.label}
          points={buildCurve(set)}
          fill="none"
          stroke={COLORS[set.label]}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      ))}

      {/* Garis centroid z* */}
      <line
        x1={cx}
        y1={PAD.top - 2}
        x2={cx}
        y2={toY(0)}
        stroke="var(--accent)"
        strokeWidth={2}
      />
      <rect x={cx - 26} y={PAD.top - 14} width={52} height={13} fill="var(--accent)" />
      <text
        x={cx}
        y={PAD.top - 4.5}
        fill="var(--bg-base)"
        fontSize={8.5}
        textAnchor="middle"
        className="stat-num"
      >
        z*={centroid.toFixed(1)}
      </text>
      </svg>

      {/* Legend */}
      <figcaption className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-text-secondary">
        {risikoVariable.sets.map((set) => (
          <span key={set.label} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block h-0 w-4 border-t-2"
              style={{ borderColor: COLORS[set.label] }}
            />
            {set.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2.5 w-4 border"
            style={{
              borderColor: "var(--text-secondary)",
              backgroundColor: "color-mix(in srgb, var(--text-secondary) 13%, transparent)",
            }}
          />
          area agregasi
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-3.5 w-0.5"
            style={{ backgroundColor: "var(--accent)" }}
          />
          centroid z*
        </span>
      </figcaption>
    </figure>
  );
}
