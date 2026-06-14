/**
 * Test/log pipeline Mamdani untuk 3 test case validasi PRD Bagian 4.6.
 * Jalankan: npx tsx scripts/test-mamdani.ts
 *
 * | TC  | Stres | Tidur | z* acuan | Kategori |
 * |-----|-------|-------|----------|----------|
 * | TC1 | 19    | 8     | ≈ 20     | Rendah   |
 * | TC2 | 36    | 6     | ≈ 40     | Sedang   |
 * | TC3 | 75    | 4     | ≈ 85     | Tinggi   |
 */

import { runMamdani } from "../lib/fuzzy/mamdani";
import type { RiskCategory } from "../lib/fuzzy/types";

interface TestCase {
  name: string;
  stres: number;
  tidur: number;
  expectedScore: number;
  expectedCategory: RiskCategory;
  /** Toleransi |z* - acuan| yang masih diterima. */
  tol: number;
}

const cases: TestCase[] = [
  { name: "TC1", stres: 19, tidur: 8, expectedScore: 20, expectedCategory: "Rendah", tol: 5 },
  { name: "TC2", stres: 36, tidur: 6, expectedScore: 40, expectedCategory: "Sedang", tol: 5 },
  { name: "TC3", stres: 75, tidur: 4, expectedScore: 85, expectedCategory: "Tinggi", tol: 5 },
];

const f = (n: number) => n.toFixed(4);
let fail = 0;

for (const tc of cases) {
  const r = runMamdani(tc.stres, tc.tidur);
  const { trace } = r;

  console.log(`\n=========== ${tc.name}  (stres=${tc.stres}, tidur=${tc.tidur}) ===========`);

  const fz = trace.fuzzification;
  console.log("1) Fuzzifikasi:");
  console.log(
    `   Stres=${fz.stres.input} → R=${f(fz.stres.degrees.Rendah)} S=${f(fz.stres.degrees.Sedang)} T=${f(fz.stres.degrees.Tinggi)}`,
  );
  console.log(
    `   Tidur=${fz.tidur.input} → Kurang=${f(fz.tidur.degrees.Rendah)} Cukup=${f(fz.tidur.degrees.Sedang)} Banyak=${f(fz.tidur.degrees.Tinggi)}`,
  );

  console.log("2) Inferensi (α = MIN), rule aktif (α>0):");
  for (const a of trace.activations) {
    if (a.alpha > 0) {
      console.log(
        `   R${a.id} [Stres ${a.stres} ∧ Tidur ${a.tidur} → ${a.output}]` +
          ` min(${f(a.stresDegree)}, ${f(a.tidurDegree)}) = ${f(a.alpha)}`,
      );
    }
  }

  console.log("3) Agregasi (MAX α per output):");
  console.log(
    `   Risiko → R=${f(trace.aggregated.Rendah)} S=${f(trace.aggregated.Sedang)} T=${f(trace.aggregated.Tinggi)}`,
  );

  console.log("4) Defuzzifikasi (centroid):");
  const okScore = Math.abs(r.score - tc.expectedScore) <= tc.tol;
  const okCat = r.category === tc.expectedCategory;
  console.log(
    `   z* = ${r.score.toFixed(2)}  (acuan ≈ ${tc.expectedScore}, tol ±${tc.tol})  ${okScore ? "✓" : "✗"}`,
  );
  console.log(
    `   kategori = ${r.category}  (acuan ${tc.expectedCategory})  ${okCat ? "✓" : "✗"}`,
  );

  if (!okScore || !okCat) fail++;
}

console.log(`\n${fail === 0 ? "✓ Semua test case lulus." : `✗ ${fail} test case gagal.`}`);
if (fail > 0) process.exit(1);
