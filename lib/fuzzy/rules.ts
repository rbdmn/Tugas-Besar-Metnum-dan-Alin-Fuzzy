/**
 * Definisi variabel fuzzy (input & output) dan rule base.
 * Mengacu pada PRD System Overview Bagian 4.1–4.3.
 */

import type { FuzzyLabel, FuzzyVariable } from "./types";

/** Variabel input: Tingkat Stres (0–100). Parameter PRD revisi. */
export const stresVariable: FuzzyVariable = {
  name: "Stres",
  range: [0, 100],
  sets: [
    { label: "Rendah", shape: "trapezoid", params: [0, 0, 25, 50] },
    { label: "Sedang", shape: "triangle", params: [25, 50, 75] },
    { label: "Tinggi", shape: "trapezoid", params: [50, 75, 100, 100] },
  ],
};

/** Variabel input: Jam Tidur (0–12). Parameter PRD revisi. */
export const tidurVariable: FuzzyVariable = {
  name: "Jam Tidur",
  range: [0, 12],
  sets: [
    { label: "Rendah", shape: "trapezoid", params: [0, 0, 4, 7] }, // "Kurang"
    { label: "Sedang", shape: "trapezoid", params: [4, 7, 9, 11] }, // "Cukup" — kini trapesium (plateau 7–9)
    { label: "Tinggi", shape: "trapezoid", params: [9, 11, 12, 12] }, // "Banyak"
  ],
};

/** Variabel output: Risiko (0–100). Parameter PRD revisi. */
export const risikoVariable: FuzzyVariable = {
  name: "Risiko",
  range: [0, 100],
  sets: [
    { label: "Rendah", shape: "trapezoid", params: [0, 0, 25, 50] },
    { label: "Sedang", shape: "triangle", params: [25, 50, 75] },
    { label: "Tinggi", shape: "trapezoid", params: [50, 75, 100, 100] },
  ],
};

/**
 * Sebuah rule: jika Stres = `stres` AND Jam Tidur = `tidur` MAKA Risiko = `output`.
 * Label tidur menggunakan keluarga Rendah/Sedang/Tinggi yang secara semantik
 * berarti Kurang/Cukup/Banyak (lihat komentar di `tidurVariable`).
 */
export interface FuzzyRule {
  stres: FuzzyLabel;
  tidur: FuzzyLabel;
  output: FuzzyLabel;
}

/**
 * Rule base 9 rule (PRD 4.3).
 *
 * | Stres \ Tidur | Kurang | Cukup  | Banyak |
 * |---------------|--------|--------|--------|
 * | Rendah        | Sedang | Rendah | Rendah |
 * | Sedang        | Tinggi | Sedang | Sedang |
 * | Tinggi        | Tinggi | Tinggi | Tinggi |
 *
 * Catatan: sel [Tinggi, Banyak] (R9) = Tinggi sesuai acuan validasi PRD revisi
 * (stres tinggi tetap berisiko tinggi meski jam tidur banyak).
 */
export const ruleBase: readonly FuzzyRule[] = [
  // Stres Rendah
  { stres: "Rendah", tidur: "Rendah", output: "Sedang" },
  { stres: "Rendah", tidur: "Sedang", output: "Rendah" },
  { stres: "Rendah", tidur: "Tinggi", output: "Rendah" },
  // Stres Sedang
  { stres: "Sedang", tidur: "Rendah", output: "Tinggi" },
  { stres: "Sedang", tidur: "Sedang", output: "Sedang" },
  { stres: "Sedang", tidur: "Tinggi", output: "Sedang" },
  // Stres Tinggi
  { stres: "Tinggi", tidur: "Rendah", output: "Tinggi" },
  { stres: "Tinggi", tidur: "Sedang", output: "Tinggi" },
  { stres: "Tinggi", tidur: "Tinggi", output: "Tinggi" }, // R9
];
