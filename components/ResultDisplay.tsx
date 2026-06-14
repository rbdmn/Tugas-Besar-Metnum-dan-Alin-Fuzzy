"use client";

import type { MamdaniResult } from "@/lib/fuzzy/mamdani";
import type { RiskCategory } from "@/lib/fuzzy/types";
import RiskGauge from "@/components/charts/RiskGauge";
import FuzzyProcess from "@/components/FuzzyProcess";

interface ResultDisplayProps {
  result: MamdaniResult;
  onReset: () => void;
}

const CATEGORY_META: Record<
  RiskCategory,
  { emoji: string; range: string; color: string }
> = {
  Rendah: { emoji: "😌", range: "0–40", color: "var(--risk-rendah)" },
  Sedang: { emoji: "😟", range: "40–65", color: "var(--risk-sedang)" },
  Tinggi: { emoji: "😰", range: "65–100", color: "var(--risk-tinggi)" },
};

export default function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const meta = CATEGORY_META[result.category];
  const score = Math.round(result.score);
  const stresInput = result.trace.fuzzification.stres.input;
  const tidurInput = result.trace.fuzzification.tidur.input;

  return (
    <section
      id="hasil"
      aria-labelledby="hasil-heading"
      aria-live="polite"
      className="mx-auto max-w-content scroll-mt-16 border-x border-b border-border-default"
    >
      <div className="flex items-center justify-between border-b border-border-default bg-surface px-5 py-3">
        <h2
          id="hasil-heading"
          className="eyebrow flex items-center gap-2 text-text-secondary"
        >
          <span style={{ color: meta.color }}>●</span> Hasil Penilaian
        </h2>
        <span className="font-mono text-xs text-text-muted">
          z* = {result.score.toFixed(2)}
        </span>
      </div>
      <p className="sr-only">
        Tingkat risiko {result.category} dengan skor {score} dari 100.
      </p>

      {/* Kategori + gauge sejajar */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center gap-4 border-b border-border-default px-6 py-6 lg:border-b-0 lg:border-r">
          <span className="text-4xl leading-none" aria-hidden>
            {meta.emoji}
          </span>
          <div>
            <span
              className="inline-block px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-[var(--bg-base)]"
              style={{ backgroundColor: meta.color }}
            >
              Risiko {result.category}
            </span>
            <p className="stat-num mt-2 text-4xl" style={{ color: meta.color }}>
              {score}
            </p>
            <p className="mt-1.5 font-mono text-xs text-text-muted">
              rentang {meta.range} · skala 0–100
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-5">
          <div className="w-full max-w-[240px]">
            <RiskGauge value={result.score} accent={meta.color} />
          </div>
        </div>
      </div>

      {/* Proses 4 tahap */}
      <FuzzyProcess result={result} />

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border-default bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-xs text-text-muted">
          Input — Stres {stresInput} · Tidur {tidurInput} jam → z*{" "}
          {result.score.toFixed(2)} → {result.category}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="border border-accent-3 px-6 py-2.5 font-display text-sm font-semibold text-accent transition-colors hover:bg-accent-3/15"
        >
          ← Isi Ulang Kuisioner
        </button>
      </div>
    </section>
  );
}
