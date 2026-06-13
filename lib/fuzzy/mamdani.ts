/**
 * Pipeline inferensi fuzzy metode Mamdani.
 * Tahapan (PRD System Overview Bagian 4.4):
 *   1. Fuzzifikasi   — derajat keanggotaan input ke tiap himpunan.
 *   2. Inferensi     — operator MIN (AND) per rule → derajat aktivasi α.
 *   3. Agregasi      — MAX α per himpunan output (lalu clip kurva output).
 *   4. Defuzzifikasi — metode Centroid (center of gravity) → skor 0–100.
 */

import { membershipOf } from "./membership";
import {
  ruleBase,
  risikoVariable,
  stresVariable,
  tidurVariable,
  type FuzzyRule,
} from "./rules";
import type {
  FuzzyLabel,
  FuzzyVariable,
  MembershipDegrees,
  RiskCategory,
} from "./types";

const LABELS: readonly FuzzyLabel[] = ["Rendah", "Sedang", "Tinggi"];

/** Langkah resolusi sampling untuk integrasi numerik centroid. */
const CENTROID_STEP = 0.1;

/** Aktivasi satu rule beserta konteksnya (untuk trace/debug). */
export interface RuleActivation {
  rule: FuzzyRule;
  stresDegree: number;
  tidurDegree: number;
  alpha: number;
}

/** Hasil lengkap pipeline + trace tiap tahap untuk validasi/debug. */
export interface MamdaniResult {
  score: number;
  category: RiskCategory;
  trace: {
    fuzzifyStres: MembershipDegrees;
    fuzzifyTidur: MembershipDegrees;
    activations: RuleActivation[];
    aggregated: MembershipDegrees; // α maksimum per himpunan output
  };
}

/** Tahap 1 — fuzzifikasi: derajat keanggotaan `x` ke tiap himpunan variabel. */
export function fuzzify(variable: FuzzyVariable, x: number): MembershipDegrees {
  const degrees: MembershipDegrees = { Rendah: 0, Sedang: 0, Tinggi: 0 };
  for (const set of variable.sets) {
    degrees[set.label] = membershipOf(x, set);
  }
  return degrees;
}

/** Tahap 2 — inferensi: α = MIN(derajat stres, derajat tidur) per rule. */
export function inferActivations(
  stresDegrees: MembershipDegrees,
  tidurDegrees: MembershipDegrees,
): RuleActivation[] {
  return ruleBase.map((rule) => {
    const stresDegree = stresDegrees[rule.stres];
    const tidurDegree = tidurDegrees[rule.tidur];
    return {
      rule,
      stresDegree,
      tidurDegree,
      alpha: Math.min(stresDegree, tidurDegree),
    };
  });
}

/** Tahap 3 — agregasi: α maksimum per himpunan output. */
export function aggregate(activations: RuleActivation[]): MembershipDegrees {
  const agg: MembershipDegrees = { Rendah: 0, Sedang: 0, Tinggi: 0 };
  for (const { rule, alpha } of activations) {
    if (alpha > agg[rule.output]) agg[rule.output] = alpha;
  }
  return agg;
}

/**
 * Tahap 4 — defuzzifikasi Centroid.
 *
 * Untuk tiap titik z pada domain output, derajat keanggotaan teragregasi adalah
 *   μ(z) = MAX_label( MIN(α_label, μ_label(z)) )   // clipping (alpha-cut) + MAX
 * Centroid: z* = Σ z·μ(z) / Σ μ(z).
 */
export function defuzzifyCentroid(aggregated: MembershipDegrees): number {
  const [lo, hi] = risikoVariable.range;
  let numerator = 0;
  let denominator = 0;

  for (let z = lo; z <= hi + 1e-9; z += CENTROID_STEP) {
    let mu = 0;
    for (const set of risikoVariable.sets) {
      const alpha = aggregated[set.label];
      if (alpha <= 0) continue;
      const clipped = Math.min(alpha, membershipOf(z, set));
      if (clipped > mu) mu = clipped; // agregasi MAX antar himpunan output
    }
    numerator += z * mu;
    denominator += mu;
  }

  // Jika tidak ada rule yang aktif sama sekali, kembalikan titik tengah domain.
  if (denominator === 0) return (lo + hi) / 2;
  return numerator / denominator;
}

/**
 * Pemetaan skor risiko → kategori (PRD 4.5).
 * Rentang tampilan: Rendah (0–40), Sedang (40–65), Tinggi (65–100).
 *
 * Skor dibulatkan dulu agar kategori konsisten dengan angka yang ditampilkan
 * ke pengguna (UI menampilkan skor sebagai bilangan bulat). Ini juga membuat
 * batas selaras dengan test case acuan PRD 4.6 yang dinyatakan dalam integer
 * (mis. TC2 z* ≈ 40 → Sedang).
 */
export function scoreToCategory(score: number): RiskCategory {
  const rounded = Math.round(score);
  if (rounded < 40) return "Rendah";
  if (rounded < 65) return "Sedang";
  return "Tinggi";
}

/** Jalankan pipeline Mamdani penuh untuk sepasang input (stres 0–100, tidur 0–12). */
export function runMamdani(stres: number, tidur: number): MamdaniResult {
  const fuzzifyStres = fuzzify(stresVariable, stres);
  const fuzzifyTidur = fuzzify(tidurVariable, tidur);
  const activations = inferActivations(fuzzifyStres, fuzzifyTidur);
  const aggregated = aggregate(activations);
  const score = defuzzifyCentroid(aggregated);
  const category = scoreToCategory(score);

  return {
    score,
    category,
    trace: { fuzzifyStres, fuzzifyTidur, activations, aggregated },
  };
}

export { LABELS };
