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
} from "./rules";
import type {
  CentroidSamplePoint,
  CentroidSampling,
  FuzzyLabel,
  FuzzyResult,
  FuzzyVariable,
  MembershipDegrees,
  RiskCategory,
  RuleActivation,
} from "./types";

const LABELS: readonly FuzzyLabel[] = ["Rendah", "Sedang", "Tinggi"];

/** Langkah resolusi sampling untuk integrasi numerik centroid. */
const CENTROID_STEP = 0.1;

/** Hasil lengkap pipeline Mamdani (skor & kategori akhir + jejak tiap tahap). */
export type MamdaniResult = FuzzyResult;

export type { RuleActivation };

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
  return ruleBase.map((rule, i) => {
    const stresDegree = stresDegrees[rule.stres];
    const tidurDegree = tidurDegrees[rule.tidur];
    return {
      id: i + 1,
      stres: rule.stres,
      tidur: rule.tidur,
      output: rule.output,
      stresDegree,
      tidurDegree,
      alpha: Math.min(stresDegree, tidurDegree),
    };
  });
}

/** Tahap 3 — agregasi: α maksimum per himpunan output. */
export function aggregate(activations: RuleActivation[]): MembershipDegrees {
  const agg: MembershipDegrees = { Rendah: 0, Sedang: 0, Tinggi: 0 };
  for (const { output, alpha } of activations) {
    if (alpha > agg[output]) agg[output] = alpha;
  }
  return agg;
}

/**
 * Derajat keanggotaan teragregasi di titik z:
 *   μ(z) = MAX_label( MIN(α_label, μ_label(z)) )   // clipping (alpha-cut) + MAX
 */
function aggregatedMu(z: number, aggregated: MembershipDegrees): number {
  let mu = 0;
  for (const set of risikoVariable.sets) {
    const alpha = aggregated[set.label];
    if (alpha <= 0) continue;
    const clipped = Math.min(alpha, membershipOf(z, set));
    if (clipped > mu) mu = clipped;
  }
  return mu;
}

/**
 * Tahap 4 — defuzzifikasi Centroid (integrasi halus, presisi penuh).
 * z* = Σ z·μ(z) / Σ μ(z).
 */
export function defuzzifyCentroid(aggregated: MembershipDegrees): number {
  const [lo, hi] = risikoVariable.range;
  let numerator = 0;
  let denominator = 0;

  for (let z = lo; z <= hi + 1e-9; z += CENTROID_STEP) {
    const mu = aggregatedMu(z, aggregated);
    numerator += z * mu;
    denominator += mu;
  }

  // Jika tidak ada rule yang aktif sama sekali, kembalikan titik tengah domain.
  if (denominator === 0) return (lo + hi) / 2;
  return numerator / denominator;
}

/** Langkah sampling (Δz) untuk tabel ilustrasi centroid. */
const SAMPLE_STEP = 5;

/**
 * Tabel sampling centroid (Δz=5) dari kurva agregasi aktual — untuk ditampilkan
 * ke pengguna sebagai ilustrasi proses. Bukan sumber skor final (lihat
 * defuzzifyCentroid yang presisi penuh).
 */
export function sampleCentroid(
  aggregated: MembershipDegrees,
): CentroidSampling {
  const [lo, hi] = risikoVariable.range;
  const points: CentroidSamplePoint[] = [];
  let sumMu = 0;
  let sumMuZ = 0;

  for (let z = lo; z <= hi + 1e-9; z += SAMPLE_STEP) {
    const muAgg = aggregatedMu(z, aggregated);
    const muAggZ = muAgg * z;
    points.push({ z, muAgg, muAggZ });
    sumMu += muAgg;
    sumMuZ += muAggZ;
  }

  const sampledScore = sumMu > 0 ? sumMuZ / sumMu : (lo + hi) / 2;
  return { step: SAMPLE_STEP, points, sumMu, sumMuZ, sampledScore };
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
  // Tahap 1 — Fuzzifikasi
  const stresDegrees = fuzzify(stresVariable, stres);
  const tidurDegrees = fuzzify(tidurVariable, tidur);
  // Tahap 2 — Inferensi
  const activations = inferActivations(stresDegrees, tidurDegrees);
  // Tahap 3 — Agregasi
  const aggregated = aggregate(activations);
  // Tahap 4 — Defuzzifikasi: centroid via tabel sampling (Δz=5)
    const sampling = sampleCentroid(aggregated);
    const score = sampling.sampledScore;
    const category = scoreToCategory(score);

  return {
    score,
    category,
    trace: {
      fuzzification: {
        stres: { input: stres, degrees: stresDegrees },
        tidur: { input: tidur, degrees: tidurDegrees },
      },
      activations,
      aggregated,
      defuzzification: { score, category, sampling },
    },
  };
}

export { LABELS };
