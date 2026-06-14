"use client";

import { membershipOf } from "@/lib/fuzzy/membership";
import type { FuzzySet, FuzzyVariable } from "@/lib/fuzzy/types";

/**
 * Kurva fungsi keanggotaan untuk SATU variabel input (preview konsep).
 * Gaya penyajian mengikuti panduan "Bentuk fungsi keanggotaan": tiga kurva
 * yang saling menyilang, nama himpunan di atas puncak, sumbu μ (0–1) & input.
 * Tanpa penanda nilai/hasil — murni preview.
 */
interface FuzzySetChartProps {
  variable: FuzzyVariable;
  /** Nama tampilan tiap himpunan (urut sesuai variable.sets). */
  displayLabels: string[];
  /** Label sumbu X (mis. "tingkat stres"). */
  axisLabel: string;
  /** Bila diisi: tandai posisi nilai input + derajat μ di tiap kurva. */
  marker?: number;
}

const W = 360;
const H = 184;
const PAD = { top: 20, right: 14, bottom: 30, left: 30 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

// Warna per indeks himpunan (rendah→tinggi), konsisten dgn chart hasil & palet PRD 2.3.
const SET_COLORS = [
  "var(--risk-rendah)",
  "var(--risk-sedang)",
  "var(--risk-tinggi)",
];

/** Titik puncak (untuk posisi label nama himpunan). */
function peakOf(set: FuzzySet): number {
  return set.shape === "triangle"
    ? set.params[1]
    : (set.params[1] + set.params[2]) / 2;
}

export default function FuzzySetChart({
  variable,
  displayLabels,
  axisLabel,
  marker,
}: FuzzySetChartProps) {
  const [lo, hi] = variable.range;
  const toX = (v: number) => PAD.left + ((v - lo) / (hi - lo)) * PLOT_W;
  const toY = (mu: number) => PAD.top + (1 - mu) * PLOT_H;
  const step = (hi - lo) / 200;

  const buildPoints = (set: FuzzySet): string => {
    const pts: string[] = [];
    for (let v = lo; v <= hi + 1e-9; v += step) {
      pts.push(`${toX(v).toFixed(1)},${toY(membershipOf(v, set)).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => lo + (hi - lo) * t);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Fungsi keanggotaan ${variable.name}: ${displayLabels.join(", ")}`}
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
          {Number.isInteger(t) ? t : t.toFixed(1)}
        </text>
      ))}
      <text
        x={PAD.left + PLOT_W / 2}
        y={H - 4}
        fill="var(--text-muted)"
        fontSize={8}
        textAnchor="middle"
        className="font-mono"
        letterSpacing="0.5"
      >
        {axisLabel}
      </text>
      <text
        x={PAD.left - 6}
        y={PAD.top - 8}
        fill="var(--text-muted)"
        fontSize={8}
        textAnchor="end"
        className="font-mono"
      >
        μ
      </text>

      {/* Kurva + label nama himpunan di atas puncak */}
      {variable.sets.map((set, i) => {
        const color = SET_COLORS[i] ?? "var(--accent)";
        return (
          <g key={set.label}>
            <polyline
              points={buildPoints(set)}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <text
              x={Math.max(
                PAD.left + 12,
                Math.min(toX(peakOf(set)), W - PAD.right - 12),
              )}
              y={PAD.top - 7}
              fill={color}
              fontSize={9}
              fontWeight={700}
              textAnchor="middle"
            >
              {displayLabels[i]}
            </text>
          </g>
        );
      })}

      {/* Penanda nilai input + derajat μ di tiap kurva */}
      {marker !== undefined &&
        (() => {
          const mx = toX(marker);
          const rightHalf = marker > (lo + hi) / 2;
          return (
            <g>
              <line
                x1={mx}
                y1={PAD.top}
                x2={mx}
                y2={toY(0)}
                stroke="var(--text-primary)"
                strokeWidth={1.4}
                strokeDasharray="3 3"
              />
              {variable.sets.map((set, i) => {
                const mu = membershipOf(marker, set);
                if (mu <= 0) return null;
                const cy = toY(mu);
                return (
                  <g key={set.label}>
                    <circle
                      cx={mx}
                      cy={cy}
                      r={3.6}
                      fill={SET_COLORS[i] ?? "var(--accent)"}
                      stroke="var(--bg-base)"
                      strokeWidth={1}
                    />
                    <text
                      x={rightHalf ? mx - 6 : mx + 6}
                      y={cy - 4}
                      fill={SET_COLORS[i] ?? "var(--accent)"}
                      fontSize={8}
                      textAnchor={rightHalf ? "end" : "start"}
                      className="font-mono"
                    >
                      {mu.toFixed(2)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}
    </svg>
  );
}
