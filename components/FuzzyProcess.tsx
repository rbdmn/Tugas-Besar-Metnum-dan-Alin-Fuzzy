"use client";

import { useState } from "react";
import { membershipOf } from "@/lib/fuzzy/membership";
import { stresVariable, tidurVariable } from "@/lib/fuzzy/rules";
import type {
  CentroidSampling,
  FuzzyLabel,
  FuzzySet,
  FuzzyVariable,
} from "@/lib/fuzzy/types";
import type { MamdaniResult } from "@/lib/fuzzy/mamdani";
import { Eyebrow, Formula, PanelHeader } from "@/components/ui/primitives";
import FuzzySetChart from "@/components/charts/FuzzySetChart";
import DefuzzChart from "@/components/charts/DefuzzChart";

/** Format angka gaya Indonesia (koma desimal). */
const idNum = (n: number, d: number) => n.toFixed(d).replace(".", ",");

/**
 * Visualisasi proses fuzzy Mamdani (4 tahap) di section Hasil.
 * Tahap 1 (Fuzzifikasi) & 4 (Defuzzifikasi) detail/menonjol;
 * Tahap 2 (Inferensi) & 3 (Agregasi) ringkas. Gaya panduan, palet Blue Lagoon.
 */

const SET_COLOR: Record<FuzzyLabel, string> = {
  Rendah: "var(--risk-rendah)",
  Sedang: "var(--risk-sedang)",
  Tinggi: "var(--risk-tinggi)",
};
// Label tidur (himpunan Rendah/Sedang/Tinggi secara semantik = Kurang/Cukup/Banyak)
const TIDUR_DISPLAY: Record<FuzzyLabel, string> = {
  Rendah: "Kurang",
  Sedang: "Cukup",
  Tinggi: "Banyak",
};
const LABELS: FuzzyLabel[] = ["Rendah", "Sedang", "Tinggi"];
const STEPS = ["Fuzzifikasi", "Inferensi", "Agregasi", "Defuzzifikasi"];

/** Bangun string perhitungan lereng untuk satu himpunan pada nilai x. */
function explainMembership(
  set: FuzzySet,
  x: number,
): { mu: number; expr: string } {
  const mu = membershipOf(x, set);
  if (mu <= 0) return { mu, expr: "0 · di luar selang" };
  if (mu >= 1)
    return {
      mu,
      expr: set.shape === "trapezoid" ? "1 · dataran" : "1 · puncak",
    };
  if (set.shape === "triangle") {
    const [a, b, c] = set.params;
    return {
      mu,
      expr:
        x < b
          ? `(${x} − ${a}) / (${b} − ${a})`
          : `(${c} − ${x}) / (${c} − ${b})`,
    };
  }
  const [a, b, c, d] = set.params;
  return {
    mu,
    expr:
      x < b ? `(${x} − ${a}) / (${b} − ${a})` : `(${d} − ${x}) / (${d} − ${c})`,
  };
}

/** Daftar perhitungan derajat keanggotaan per himpunan (Tahap 1). */
function WorkedDegrees({
  variable,
  input,
  displayLabels,
}: {
  variable: FuzzyVariable;
  input: number;
  displayLabels: string[];
}) {
  return (
    <table className="w-full border-collapse font-mono text-xs">
      <tbody>
        {variable.sets.map((set, i) => {
          const { mu, expr } = explainMembership(set, input);
          const active = mu > 0;
          return (
            <tr
              key={set.label}
              className={`border-b border-border-default last:border-0 ${active ? "" : "opacity-45"}`}
            >
              <td className="py-1.5">
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: SET_COLOR[set.label] }}
                  />
                  <span className="text-text-secondary">
                    {displayLabels[i]}
                  </span>
                </span>
              </td>
              <td className="py-1.5 text-right text-text-muted">{expr}</td>
              <td className="py-1.5 pl-3 text-right text-text-primary">
                μ={mu.toFixed(2)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Formula numerik z* (selalu tampil) + tabel sampling Δz=5 (collapsible). */
function SamplingTable({ sampling }: { sampling: CentroidSampling }) {
  const [open, setOpen] = useState(false);
  const { points, sumMu, sumMuZ, sampledScore, step } = sampling;

  return (
    <div className="space-y-3">
      {/* Formula numerik — selalu terlihat tanpa expand */}
      <Formula caption={`substitusi total dari tabel sampling (Δz=${step})`}>
        z* = Σ[μ(z)·z] / Σμ(z) = {idNum(sumMuZ, 2)} / {idNum(sumMu, 3)} ≈{" "}
        {idNum(sampledScore, 1)}
      </Formula>

      {/* Toggle detail tabel */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border border-border-default bg-surface/40 px-3 py-2 text-left font-mono text-xs text-text-secondary transition-colors hover:bg-surface"
      >
        <span>
          Lihat detail tabel sampling · {points.length} titik (Δz={step})
        </span>
        <span
          aria-hidden
          className="text-accent transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border border-border-default">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-border-default bg-surface/40">
                  <th className="eyebrow px-3 py-2 text-left">z</th>
                  <th className="eyebrow px-3 py-2 text-right">μ_agg(z)</th>
                  <th className="eyebrow px-3 py-2 text-right">μ_agg(z)·z</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr
                    key={p.z}
                    className={`border-b border-border-default ${p.muAgg > 0 ? "" : "opacity-45"}`}
                  >
                    <td className="px-3 py-1 text-text-secondary">{p.z}</td>
                    <td className="px-3 py-1 text-right text-text-primary">
                      {idNum(p.muAgg, 3)}
                    </td>
                    <td className="px-3 py-1 text-right text-text-primary">
                      {idNum(p.muAggZ, 2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-surface/40 font-bold">
                  <td className="px-3 py-2 text-text-primary">Σ</td>
                  <td className="px-3 py-2 text-right text-text-primary">
                    {idNum(sumMu, 3)}
                  </td>
                  <td className="px-3 py-2 text-right text-text-primary">
                    {idNum(sumMuZ, 2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-text-muted">
        Skor risiko final dihitung menggunakan metode centroid dengan titik
        sampling (Δz=5).
      </p>
    </div>
  );
}

export default function FuzzyProcess({ result }: { result: MamdaniResult }) {
  const { trace } = result;
  const stresInput = trace.fuzzification.stres.input;
  const tidurInput = trace.fuzzification.tidur.input;
  const activeRules = trace.activations.filter((a) => a.alpha > 0);

  return (
    <div>
      {/* Pipeline */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border-default bg-surface/40 px-5 py-3">
        <Eyebrow className="mr-1">Proses Mamdani</Eyebrow>
        {STEPS.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="border border-border-default px-2 py-1 font-mono text-[11px] text-text-secondary">
              {i + 1}. {s}
            </span>
            {i < STEPS.length - 1 && <span className="text-text-muted">→</span>}
          </span>
        ))}
      </div>

      {/* ===== TAHAP 1 — FUZZIFIKASI (detail) ===== */}
      <div className="border-t border-border-default">
        <PanelHeader
          label={<>Tahap 1 · Fuzzifikasi</>}
          meta="nilai input → derajat μ"
        />
        <div className="space-y-5 px-5 py-5">
          {/* Rumus lereng */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Formula caption="sisi NAIK — kaki μ=0 di kiri (a), puncak di b">
              μ = (x − a) / (b − a)
            </Formula>
            <Formula caption="sisi TURUN — puncak di c, kaki μ=0 di kanan (d)">
              μ = (d − x) / (d − c)
            </Formula>
          </div>

          {/* Catatan arti derajat μ (ringkas, tidak teknis) */}
          <div className="border-l-2 border-accent-3 bg-surface/40 px-4 py-2.5">
            <p className="text-sm text-text-secondary">
              Angka <span className="font-mono text-text-primary">μ</span> (0–1)
              menunjukkan seberapa kuat nilaimu masuk ke tiap kategori — makin
              mendekati <span className="font-mono text-text-primary">1</span>,
              makin kuat kecocokannya.
            </p>
          </div>

          {/* Stres & Tidur: chart TERPISAH per variabel + derajat */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <p className="font-display text-sm font-bold text-text-primary">
                  Stres{" "}
                  <span className="font-mono text-xs font-normal text-text-muted">
                    (0–100)
                  </span>
                </p>
                <p className="font-mono text-xs text-text-secondary">
                  nilai ={" "}
                  <span className="stat-num text-text-primary">
                    {stresInput}
                  </span>
                </p>
              </div>
              <FuzzySetChart
                variable={stresVariable}
                displayLabels={["Rendah", "Sedang", "Tinggi"]}
                axisLabel="tingkat stres"
                marker={stresInput}
              />
              <div className="mt-3">
                <WorkedDegrees
                  variable={stresVariable}
                  input={stresInput}
                  displayLabels={["Rendah", "Sedang", "Tinggi"]}
                />
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <p className="font-display text-sm font-bold text-text-primary">
                  Jam Tidur{" "}
                  <span className="font-mono text-xs font-normal text-text-muted">
                    (0–12)
                  </span>
                </p>
                <p className="font-mono text-xs text-text-secondary">
                  nilai ={" "}
                  <span className="stat-num text-text-primary">
                    {tidurInput}
                  </span>
                </p>
              </div>
              <FuzzySetChart
                variable={tidurVariable}
                displayLabels={["Kurang", "Cukup", "Banyak"]}
                axisLabel="jam tidur"
                marker={tidurInput}
              />
              <div className="mt-3">
                <WorkedDegrees
                  variable={tidurVariable}
                  input={tidurInput}
                  displayLabels={["Kurang", "Cukup", "Banyak"]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TAHAP 2 & 3 (ringkas, berdampingan) ===== */}
      <div className="grid grid-cols-1 border-t border-border-default lg:grid-cols-2">
        {/* TAHAP 2 — INFERENSI */}
        <div className="lg:border-r lg:border-border-default">
          <PanelHeader
            label={<>Tahap 2 · Inferensi</>}
            meta="AND=min · OR=max"
          />
          <div className="space-y-4 px-5 py-5">
            <div className="grid grid-cols-2 gap-3">
              <Formula size="sm" caption="gabungan AND">
                α = min(…)
              </Formula>
              <Formula size="sm" caption="gabungan OR">
                max(…)
              </Formula>
            </div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="eyebrow py-2 text-left">Rule</th>
                  <th className="eyebrow py-2 text-left">Kondisi</th>
                  <th className="eyebrow py-2 text-right">α</th>
                  <th className="eyebrow py-2 text-right">→ Risiko</th>
                </tr>
              </thead>
              <tbody>
                {activeRules.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border-default last:border-0"
                  >
                    <td className="py-1.5 font-mono text-text-muted">
                      R{a.id}
                    </td>
                    <td className="py-1.5 text-text-secondary">
                      {a.stres} ∧ {TIDUR_DISPLAY[a.tidur]}
                    </td>
                    <td className="py-1.5 text-right font-mono text-text-primary">
                      {a.alpha.toFixed(2)}
                    </td>
                    <td
                      className="py-1.5 text-right font-mono"
                      style={{ color: SET_COLOR[a.output] }}
                    >
                      {a.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TAHAP 3 — AGREGASI */}
        <div className="border-t border-border-default lg:border-t-0">
          <PanelHeader
            label={<>Tahap 3 · Agregasi</>}
            meta="α maks per output"
          />
          <div className="space-y-3 px-5 py-5">
            {LABELS.map((label) => {
              const a = trace.aggregated[label];
              return (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: SET_COLOR[label] }}
                      />
                      <span className="text-text-secondary">{label}</span>
                    </span>
                    <span className="font-mono text-text-primary">
                      α={a.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-border-default">
                    <div
                      className="h-full"
                      style={{
                        width: `${a * 100}%`,
                        backgroundColor: SET_COLOR[label],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== TAHAP 4 — DEFUZZIFIKASI (detail) ===== */}
      <div className="border-t border-border-default">
        <PanelHeader
          label={<>Tahap 4 · Defuzzifikasi</>}
          meta="centroid (titik seimbang)"
        />
        <div className="space-y-5 px-5 py-5">
          <Formula caption="titik seimbang = total (tinggi × posisi) ÷ total tinggi">
            z* = Σ [ μ(z) · z ] / Σ μ(z)
          </Formula>

          <div className="mx-auto max-w-2xl">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="font-display text-sm font-bold text-text-primary">
                Risiko{" "}
                <span className="font-mono text-xs font-normal text-text-muted">
                  (0–100)
                </span>
              </p>
              <p className="font-mono text-xs text-text-muted">
                3 himpunan output + area agregasi
              </p>
            </div>
            <DefuzzChart
              aggregated={trace.aggregated}
              centroid={result.score}
            />
          </div>

          {/* Tabel sampling centroid (formula numerik + detail collapsible) */}
          <SamplingTable sampling={trace.defuzzification.sampling} />

          <p className="text-center font-mono text-sm text-text-secondary">
            Skor risiko final: z* ={" "}
            <span className="stat-num text-text-primary">
              {result.score.toFixed(2)}
            </span>{" "}
            →{" "}
            <span style={{ color: SET_COLOR[result.category] }}>
              Risiko {result.category}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
