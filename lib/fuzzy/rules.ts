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
 * | Stres \ Tidur | Kurang | Cukup  | Berlebih |
 * |---------------|--------|--------|----------|
 * | Rendah        | Sedang | Rendah | Sedang   |
 * | Sedang        | Tinggi | Sedang | Sedang   |
 * | Tinggi        | Tinggi | Sedang | Tinggi   |
 *
 * Mengikuti Tabel 3.3 (matriks basis aturan laporan). Catatan sel khusus:
 * R3 [Rendah, Berlebih] = Sedang, R8 [Tinggi, Cukup] = Sedang,
 * R9 [Tinggi, Berlebih] = Tinggi.
 */
export const ruleBase: readonly FuzzyRule[] = [
  // Stres Rendah
  { stres: "Rendah", tidur: "Rendah", output: "Sedang" }, // R1
  { stres: "Rendah", tidur: "Sedang", output: "Rendah" }, // R2
  { stres: "Rendah", tidur: "Tinggi", output: "Sedang" }, // R3  (Berlebih → Sedang)
  // Stres Sedang
  { stres: "Sedang", tidur: "Rendah", output: "Tinggi" }, // R4
  { stres: "Sedang", tidur: "Sedang", output: "Sedang" }, // R5
  { stres: "Sedang", tidur: "Tinggi", output: "Sedang" }, // R6
  // Stres Tinggi
  { stres: "Tinggi", tidur: "Rendah", output: "Tinggi" }, // R7
  { stres: "Tinggi", tidur: "Sedang", output: "Sedang" }, // R8  (Cukup → Sedang)
  { stres: "Tinggi", tidur: "Tinggi", output: "Tinggi" }, // R9
];
