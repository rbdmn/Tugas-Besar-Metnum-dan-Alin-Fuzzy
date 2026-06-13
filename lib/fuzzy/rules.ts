/**
 * Definisi variabel fuzzy (input & output) dan rule base.
 * Mengacu pada PRD System Overview Bagian 4.1–4.3.
 */

import type { FuzzyLabel, FuzzyVariable } from "./types";

/** Variabel input: Tingkat Stres (0–100). PRD 4.1. */
export const stresVariable: FuzzyVariable = {
  name: "Stres",
  range: [0, 100],
  sets: [
    { label: "Rendah", shape: "trapezoid", params: [0, 0, 20, 40] },
    { label: "Sedang", shape: "triangle", params: [30, 50, 70] },
    { label: "Tinggi", shape: "trapezoid", params: [60, 80, 100, 100] },
  ],
};

/** Variabel input: Jam Tidur (0–12). PRD 4.1. */
export const tidurVariable: FuzzyVariable = {
  name: "Jam Tidur",
  range: [0, 12],
  sets: [
    { label: "Rendah", shape: "trapezoid", params: [0, 0, 4, 6] }, // "Kurang"
    { label: "Sedang", shape: "triangle", params: [5, 7, 9] }, // "Cukup"
    { label: "Tinggi", shape: "trapezoid", params: [8, 10, 12, 12] }, // "Banyak"
  ],
};

/** Variabel output: Risiko (0–100). PRD 4.2. */
export const risikoVariable: FuzzyVariable = {
  name: "Risiko",
  range: [0, 100],
  sets: [
    { label: "Rendah", shape: "trapezoid", params: [0, 0, 25, 45] },
    { label: "Sedang", shape: "triangle", params: [35, 55, 75] },
    { label: "Tinggi", shape: "trapezoid", params: [65, 80, 100, 100] },
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
 * | Tinggi        | Tinggi | Tinggi | Sedang |
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
  { stres: "Tinggi", tidur: "Tinggi", output: "Sedang" },
];
