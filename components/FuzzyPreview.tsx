"use client";

import { useState } from "react";
import FuzzySetChart from "@/components/charts/FuzzySetChart";
import { stresVariable, tidurVariable } from "@/lib/fuzzy/rules";
import type { FuzzySet, FuzzyVariable } from "@/lib/fuzzy/types";
import { Eyebrow } from "@/components/ui/primitives";

/**
 * Section "Himpunan Fuzzy" — parameter & bentuk fungsi keanggotaan variabel input.
 * Collapsible: klik header untuk tutup/buka. Tiap variabel ditampilkan sebagai
 * tabel (Himpunan/Tipe/Parameter) + kurva membership. Palet Blue Lagoon.
 */

const SHAPE_LABEL: Record<FuzzySet["shape"], string> = {
  triangle: "Segitiga",
  trapezoid: "Trapesium",
};

// Warna penanda per indeks himpunan (rendah→tinggi), konsisten dgn kurva.
const DOT_COLORS = [
  "var(--risk-rendah)",
  "var(--risk-sedang)",
  "var(--risk-tinggi)",
];

interface VarBlockProps {
  title: string;
  variable: FuzzyVariable;
  displayLabels: string[];
  axisLabel: string;
}

function VarBlock({ title, variable, displayLabels, axisLabel }: VarBlockProps) {
  return (
    <div className="px-5 py-5">
      <Eyebrow className="mb-3">{title}</Eyebrow>

      {/* Tabel parameter */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-default">
            <th className="eyebrow py-2 text-left">Himpunan</th>
            <th className="eyebrow py-2 text-left">Tipe</th>
            <th className="eyebrow py-2 text-right">Parameter</th>
          </tr>
        </thead>
        <tbody>
          {variable.sets.map((set, i) => (
            <tr
              key={set.label}
              className="border-b border-border-default last:border-0"
            >
              <td className="py-2">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: DOT_COLORS[i] }}
                  />
                  <span className="text-sm text-text-primary">
                    {displayLabels[i]}
                  </span>
                </span>
              </td>
              <td className="py-2 text-sm text-text-secondary">
                {SHAPE_LABEL[set.shape]}
              </td>
              <td className="py-2 text-right font-mono text-sm text-text-primary">
                [{set.params.join(", ")}]
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Kurva */}
      <div className="mt-5">
        <FuzzySetChart
          variable={variable}
          displayLabels={displayLabels}
          axisLabel={axisLabel}
        />
      </div>
    </div>
  );
}

export default function FuzzyPreview() {
  const [open, setOpen] = useState(true);

  return (
    <section
      id="himpunan"
      aria-labelledby="himpunan-heading"
      className="panel-shadow mx-auto max-w-content border border-border-default"
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="himpunan-body"
        className={`flex w-full items-center justify-between bg-surface px-5 py-3 text-left transition-colors hover:bg-surface-raised ${
          open ? "border-b border-border-default" : ""
        }`}
      >
        <span
          id="himpunan-heading"
          className="eyebrow flex items-center gap-2 text-text-secondary"
        >
          <span className="text-accent">◈</span> Himpunan Fuzzy · Parameter
          Fungsi Keanggotaan
        </span>
        <span className="flex items-center gap-2">
          <span className="hidden font-mono text-xs text-text-muted sm:inline">
            {open ? "sembunyikan" : "tampilkan"}
          </span>
          <span
            aria-hidden
            className="inline-block font-mono text-accent transition-transform duration-300"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▸
          </span>
        </span>
      </button>

      {/* Body collapsible (animasi tinggi via grid-rows) */}
      <div
        id="himpunan-body"
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {/* Penjelasan singkat */}
          <div className="border-b border-border-default px-5 py-4">
            <p className="max-w-3xl text-sm text-text-secondary">
              Tiap variabel input punya tiga{" "}
              <span className="text-text-primary">himpunan fuzzy</span> yang
              didefinisikan oleh bentuk kurva (trapesium/segitiga) dan
              parameternya. Kurva inilah yang mengukur{" "}
              <span className="text-text-primary">seberapa besar</span> sebuah
              nilai termasuk tiap kategori, dalam derajat{" "}
              <span className="font-mono text-text-primary">0–1</span>.
            </p>
          </div>

          {/* Dua variabel input */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-b border-border-default lg:border-b-0 lg:border-r">
              <VarBlock
                title="Stres · 0–100"
                variable={stresVariable}
                displayLabels={["Rendah", "Sedang", "Tinggi"]}
                axisLabel="tingkat stres"
              />
            </div>
            <VarBlock
              title="Jam Tidur · 0–12"
              variable={tidurVariable}
              displayLabels={["Kurang", "Cukup", "Banyak"]}
              axisLabel="jam tidur"
            />
          </div>

          {/* Catatan overlap */}
          <div className="border-t border-border-default bg-surface/40 px-5 py-3">
            <p className="font-mono text-[11px] text-text-muted">
              Notasi: segitiga [a, b, c] · trapesium [a, b, c, d]. Bagian kurva
              yang menyilang (overlap) membuat perpindahan antar kategori halus,
              bukan meloncat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
