"use client";

import type { MamdaniResult } from "@/lib/fuzzy/mamdani";
import type { FuzzyLabel, MembershipDegrees, RiskCategory } from "@/lib/fuzzy/types";
import type { QuestionnaireInputs } from "@/components/Questionnaire";
import RiskGauge from "@/components/charts/RiskGauge";
import MembershipChart from "@/components/charts/MembershipChart";
import { Eyebrow, PanelHeader } from "@/components/ui/primitives";

interface ResultDisplayProps {
  result: MamdaniResult;
  inputs: QuestionnaireInputs;
  onReset: () => void;
}

const CATEGORY_META: Record<RiskCategory, { emoji: string; range: string; color: string }> = {
  Rendah: { emoji: "😌", range: "0–40", color: "var(--risk-rendah)" },
  Sedang: { emoji: "😟", range: "40–65", color: "var(--risk-sedang)" },
  Tinggi: { emoji: "😰", range: "65–100", color: "var(--risk-tinggi)" },
};

const LABELS: FuzzyLabel[] = ["Rendah", "Sedang", "Tinggi"];

/** Tabel mini derajat keanggotaan (fuzzifikasi) — data eksplisit. */
function DegreeTable({
  title,
  degrees,
}: {
  title: string;
  degrees: MembershipDegrees;
}) {
  return (
    <div>
      <Eyebrow className="mb-2">{title}</Eyebrow>
      <div className="border border-border-default">
        {LABELS.map((l, i) => (
          <div
            key={l}
            className={`flex items-center justify-between px-3 py-1.5 ${
              i > 0 ? "border-t border-border-default" : ""
            }`}
          >
            <span className="text-xs text-text-secondary">{l}</span>
            <span
              className={`stat-num text-sm ${
                degrees[l] > 0 ? "text-text-primary" : "text-text-muted"
              }`}
            >
              {degrees[l].toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultDisplay({ result, inputs, onReset }: ResultDisplayProps) {
  const meta = CATEGORY_META[result.category];
  const score = Math.round(result.score);

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

      {/* Grafik membership full-width */}
      <div className="border-t border-border-default">
        <PanelHeader
          label={<>Fungsi Keanggotaan Output (Risiko)</>}
          meta="μ vs skor"
        />
        <div className="px-5 py-5">
          <div className="mx-auto max-w-xl">
            <MembershipChart
              value={result.score}
              aggregated={result.trace.aggregated}
            />
            <p className="mt-3 font-mono text-[11px] text-text-muted">
              Garis putus-putus = posisi skor hasil · α = derajat aktivasi
              agregat tiap himpunan output.
            </p>
          </div>
        </div>
      </div>

      {/* Rincian fuzzifikasi (data eksplisit) */}
      <div className="border-t border-border-default">
        <PanelHeader label={<>Rincian Fuzzifikasi</>} meta="derajat keanggotaan input" />
        <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
          <DegreeTable title={`Stres = ${inputs.stressScore}`} degrees={result.trace.fuzzifyStres} />
          <DegreeTable title={`Jam Tidur = ${inputs.sleepHours}`} degrees={result.trace.fuzzifyTidur} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border-default bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-xs text-text-muted">
          Defuzzifikasi centroid → z* = {result.score.toFixed(2)} → {result.category}
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
