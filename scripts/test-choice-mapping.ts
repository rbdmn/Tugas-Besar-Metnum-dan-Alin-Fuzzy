/**
 * Verifikasi pipeline dengan input skala Likert 1–5 (setelah konversi ke 0–10).
 * Jalankan: npx tsx scripts/test-choice-mapping.ts
 *
 * Karena nilai terkonversi kelipatan 2.5, skor stres tepat 19/36 tidak bisa
 * dicapai; dipakai pilihan 1–5 yang ekuivalen (skor terdekat) lalu dipastikan
 * kategori & z* tetap konsisten dengan acuan PRD 4.6.
 */

import { choiceToScore } from "../lib/questions";
import { runMamdani } from "../lib/fuzzy/mamdani";
import type { RiskCategory } from "../lib/fuzzy/types";

interface Case {
  name: string;
  choices: number[]; // 10 pilihan 1–5
  sleep: number;
  origStress: number; // skor stres asli pada test case
  expectedCategory: RiskCategory;
  refScore: number;
}

const cases: Case[] = [
  {
    name: "TC1",
    choices: [3, 3, 3, 3, 1, 1, 1, 1, 1, 1], // → 20
    sleep: 8,
    origStress: 19,
    expectedCategory: "Rendah",
    refScore: 20,
  },
  {
    name: "TC2",
    choices: [4, 4, 4, 4, 4, 1, 1, 1, 1, 1], // → 37.5
    sleep: 6,
    origStress: 36,
    expectedCategory: "Sedang",
    refScore: 40,
  },
  {
    name: "TC3",
    choices: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // → 75
    sleep: 4,
    origStress: 75,
    expectedCategory: "Tinggi",
    refScore: 85,
  },
];

let fail = 0;
console.log("Mapping pilihan: 1→0, 2→2.5, 3→5, 4→7.5, 5→10\n");

for (const c of cases) {
  const stress = c.choices.reduce((s, ch) => s + choiceToScore(ch), 0);
  const r = runMamdani(stress, c.sleep);
  const okCat = r.category === c.expectedCategory;
  // Toleransi lebih longgar karena skor stres ekuivalen sedikit berbeda dari asli.
  const okScore = Math.abs(r.score - c.refScore) <= 6;
  console.log(
    `${c.name}: pilihan [${c.choices.join(",")}] sleep=${c.sleep}\n` +
      `  stres terkonversi = ${stress} (asli ${c.origStress})\n` +
      `  z* = ${r.score.toFixed(2)} (acuan ≈ ${c.refScore})  ${okScore ? "✓" : "✗"}\n` +
      `  kategori = ${r.category} (acuan ${c.expectedCategory})  ${okCat ? "✓" : "✗"}\n`,
  );
  if (!okCat || !okScore) fail++;
}

console.log(fail === 0 ? "✓ Semua konsisten." : `✗ ${fail} kasus gagal.`);
if (fail > 0) process.exit(1);
