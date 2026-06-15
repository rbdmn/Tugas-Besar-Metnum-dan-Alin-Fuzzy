/**
 * Quick test/log untuk lib/fuzzy/membership.ts.
 * Jalankan: npx tsx scripts/test-membership.ts
 *
 * Fixture diambil LANGSUNG dari rules.ts (bukan hardcode) supaya selalu sinkron
 * dengan parameter PRD terbaru — termasuk "Cukup" (Jam Tidur) yang kini trapesium
 * 4-parameter [4,7,9,11], bukan lagi segitiga.
 */

import { membershipOf } from "../lib/fuzzy/membership";
import {
  stresVariable,
  tidurVariable,
  risikoVariable,
} from "../lib/fuzzy/rules";
import type { FuzzyLabel, FuzzyVariable } from "../lib/fuzzy/types";

let pass = 0;
let fail = 0;

/** μ untuk himpunan berlabel `label` pada variabel, di nilai x. */
function mu(variable: FuzzyVariable, label: FuzzyLabel, x: number): number {
  const set = variable.sets.find((s) => s.label === label)!;
  return membershipOf(x, set);
}

function expect(label: string, actual: number, expected: number): void {
  const ok = Math.abs(actual - expected) < 1e-3;
  console.log(`  ${ok ? "✓" : "✗"} ${label}: ${actual.toFixed(3)} (harap ${expected.toFixed(3)})`);
  if (ok) pass++;
  else fail++;
}

console.log("== STRES (Rendah[0,0,25,50] Sedang[25,50,75] Tinggi[50,75,100,100]) ==");
expect("Rendah s=15", mu(stresVariable, "Rendah", 15), 1.0);
expect("Rendah s=30", mu(stresVariable, "Rendah", 30), 0.8);
expect("Sedang s=30", mu(stresVariable, "Sedang", 30), 0.2);
expect("Sedang s=50 (puncak)", mu(stresVariable, "Sedang", 50), 1.0);
expect("Tinggi s=70", mu(stresVariable, "Tinggi", 70), 0.8);
expect("Tinggi s=88 (plateau)", mu(stresVariable, "Tinggi", 88), 1.0);
expect("Tinggi s=100 (bahu)", mu(stresVariable, "Tinggi", 100), 1.0);

console.log("== JAM TIDUR (Kurang[0,0,4,7] Cukup[4,7,9,11] Banyak[9,11,12,12]) ==");
expect("Kurang t=3 (plateau)", mu(tidurVariable, "Rendah", 3), 1.0);
expect("Kurang t=5", mu(tidurVariable, "Rendah", 5), 0.667);
expect("Cukup t=5 (naik)", mu(tidurVariable, "Sedang", 5), 0.333);
expect("Cukup t=7 (plateau kiri)", mu(tidurVariable, "Sedang", 7), 1.0);
expect("Cukup t=8 (dataran)", mu(tidurVariable, "Sedang", 8), 1.0);
expect("Cukup t=9 (plateau kanan)", mu(tidurVariable, "Sedang", 9), 1.0);
expect("Cukup t=10 (turun)", mu(tidurVariable, "Sedang", 10), 0.5);
expect("Banyak t=11 (plateau)", mu(tidurVariable, "Tinggi", 11), 1.0);

console.log("== RISIKO (output) ==");
expect("Rendah z=0 (bahu)", mu(risikoVariable, "Rendah", 0), 1.0);
expect("Sedang z=50 (puncak)", mu(risikoVariable, "Sedang", 50), 1.0);
expect("Tinggi z=88 (plateau)", mu(risikoVariable, "Tinggi", 88), 1.0);

console.log("== Batas & luar domain ==");
expect("Stres Rendah s=50 (kaki)", mu(stresVariable, "Rendah", 50), 0.0);
expect("Cukup t=4 (kaki)", mu(tidurVariable, "Sedang", 4), 0.0);
expect("Cukup t=11 (kaki)", mu(tidurVariable, "Sedang", 11), 0.0);

console.log(`\nHasil: ${pass} lulus, ${fail} gagal.`);
if (fail > 0) process.exit(1);
