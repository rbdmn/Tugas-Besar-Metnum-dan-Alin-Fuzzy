/**
 * Validasi parameter PRD revisi — 4 kasus acuan resmi (pengganti TC1–3 lama).
 * Jalankan: npx tsx scripts/test-validation.ts
 */

import { runMamdani } from "../lib/fuzzy/mamdani";

interface Expect {
  name: string;
  stres: number;
  tidur: number;
  fuzz: Record<string, number>; // label → μ ekspektasi
  domRuleId: number;
  domAlpha: number;
  domOutput: string;
  zStar: number;
  category: string;
}

const cases: Expect[] = [
  {
    name: "Kasus 1",
    stres: 70,
    tidur: 5,
    fuzz: { "Stres.Sedang": 0.2, "Stres.Tinggi": 0.8, "Tidur.Kurang": 0.667, "Tidur.Cukup": 0.333 },
    domRuleId: 7,
    domAlpha: 0.667,
    domOutput: "Tinggi",
    zStar: 70.6,
    category: "Tinggi",
  },
  {
    name: "Kasus 2",
    stres: 15,
    tidur: 8,
    fuzz: { "Stres.Rendah": 1.0, "Tidur.Cukup": 1.0 },
    domRuleId: 2,
    domAlpha: 1.0,
    domOutput: "Rendah",
    zStar: 19.2,
    category: "Rendah",
  },
  {
    name: "Kasus 3",
    stres: 30,
    tidur: 3,
    fuzz: { "Stres.Rendah": 0.8, "Stres.Sedang": 0.2, "Tidur.Kurang": 1.0 },
    domRuleId: 1,
    domAlpha: 0.8,
    domOutput: "Sedang",
    zStar: 56.9,
    category: "Sedang",
  },
  {
    name: "Kasus 4",
    stres: 88,
    tidur: 11,
    fuzz: { "Stres.Tinggi": 1.0, "Tidur.Banyak": 1.0 },
    domRuleId: 9,
    domAlpha: 1.0,
    domOutput: "Tinggi",
    zStar: 80.8,
    category: "Tinggi",
  },
];

const f = (n: number) => n.toFixed(3);
const TIDUR_NAME: Record<string, string> = { Rendah: "Kurang", Sedang: "Cukup", Tinggi: "Banyak" };

for (const c of cases) {
  const r = runMamdani(c.stres, c.tidur);
  const fz = r.trace.fuzzification;
  const dom = r.trace.activations.reduce((a, b) => (b.alpha > a.alpha ? b : a));

  // actual fuzzification keyed
  const actualFuzz: Record<string, number> = {
    "Stres.Rendah": fz.stres.degrees.Rendah,
    "Stres.Sedang": fz.stres.degrees.Sedang,
    "Stres.Tinggi": fz.stres.degrees.Tinggi,
    "Tidur.Kurang": fz.tidur.degrees.Rendah,
    "Tidur.Cukup": fz.tidur.degrees.Sedang,
    "Tidur.Banyak": fz.tidur.degrees.Tinggi,
  };

  console.log(`\n=== ${c.name}  (Stres=${c.stres}, Tidur=${c.tidur}) ===`);
  console.log("  Fuzzifikasi:");
  for (const [k, exp] of Object.entries(c.fuzz)) {
    const act = actualFuzz[k];
    const ok = Math.abs(act - exp) < 0.01;
    console.log(`    ${k}: aktual=${f(act)} exp=${f(exp)} ${ok ? "✓" : "✗"}`);
  }
  console.log(
    `  Rule dominan: R${dom.id} (${dom.stres} ∧ ${TIDUR_NAME[dom.tidur]} → ${dom.output}) α=${f(dom.alpha)}` +
      `  | exp R${c.domRuleId} α=${f(c.domAlpha)} → ${c.domOutput}` +
      `  ${dom.id === c.domRuleId && Math.abs(dom.alpha - c.domAlpha) < 0.01 && dom.output === c.domOutput ? "✓" : "✗"}`,
  );
  const okZ = Math.abs(r.score - c.zStar) <= 2;
  const okCat = r.category === c.category;
  console.log(`  z* aktual=${r.score.toFixed(2)} exp≈${c.zStar} (±2) ${okZ ? "✓" : "✗"}`);
  console.log(`  Kategori aktual=${r.category} exp=${c.category} ${okCat ? "✓" : "✗"}`);
}
