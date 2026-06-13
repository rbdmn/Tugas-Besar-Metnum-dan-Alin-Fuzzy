/**
 * Quick test/log untuk lib/fuzzy/membership.ts.
 * Jalankan: npx tsx scripts/test-membership.ts
 *
 * Bukan unit test framework — hanya verifikasi cepat bahwa beberapa nilai input
 * menghasilkan derajat keanggotaan yang benar sesuai parameter PRD Bagian 4.1–4.2.
 */

import { triangle, trapezoid } from "../lib/fuzzy/membership";
import type { TriangleParams, TrapezoidParams } from "../lib/fuzzy/types";

// Parameter himpunan sesuai PRD (belum dipakai pipeline; hanya untuk uji fungsi).
const STRES = {
  Rendah: [0, 0, 20, 40] as TrapezoidParams,
  Sedang: [30, 50, 70] as TriangleParams,
  Tinggi: [60, 80, 100, 100] as TrapezoidParams,
};
const TIDUR = {
  Kurang: [0, 0, 4, 6] as TrapezoidParams,
  Cukup: [5, 7, 9] as TriangleParams,
  Banyak: [8, 10, 12, 12] as TrapezoidParams,
};

let pass = 0;
let fail = 0;

/** Bandingkan dengan toleransi floating point. */
function expect(label: string, actual: number, expected: number): void {
  const ok = Math.abs(actual - expected) < 1e-9;
  const mark = ok ? "✓" : "✗";
  console.log(
    `  ${mark} ${label}: ${actual.toFixed(4)} (harap ${expected.toFixed(4)})`,
  );
  if (ok) pass++;
  else fail++;
}

console.log("== Membership: STRES ==");
// TC1 stres=19 → Rendah penuh
expect("triangle? Rendah trap stres=19", trapezoid(19, STRES.Rendah), 1.0);
expect("Sedang stres=19", triangle(19, STRES.Sedang), 0.0);
expect("Tinggi stres=19", trapezoid(19, STRES.Tinggi), 0.0);

// TC2 stres=36 → Rendah 0.2, Sedang 0.3
expect("Rendah stres=36", trapezoid(36, STRES.Rendah), 0.2);
expect("Sedang stres=36", triangle(36, STRES.Sedang), 0.3);

// puncak segitiga
expect("Sedang stres=50 (puncak)", triangle(50, STRES.Sedang), 1.0);

// TC3 stres=75 → Tinggi 0.75
expect("Tinggi stres=75", trapezoid(75, STRES.Tinggi), 0.75);
// plateau & bahu kanan tegak
expect("Tinggi stres=80 (plateau)", trapezoid(80, STRES.Tinggi), 1.0);
expect("Tinggi stres=100 (bahu tegak)", trapezoid(100, STRES.Tinggi), 1.0);

console.log("== Membership: JAM TIDUR ==");
// TC1 tidur=8 → Cukup 0.5, Banyak 0 (di kaki a=8)
expect("Cukup tidur=8", triangle(8, TIDUR.Cukup), 0.5);
expect("Banyak tidur=8 (di kaki)", trapezoid(8, TIDUR.Banyak), 0.0);
// TC2 tidur=6 → Cukup 0.5, Kurang 0 (di kaki d=6)
expect("Cukup tidur=6", triangle(6, TIDUR.Cukup), 0.5);
expect("Kurang tidur=6 (di kaki)", trapezoid(6, TIDUR.Kurang), 0.0);
// TC3 tidur=4 → Kurang penuh (di bahu c=4)
expect("Kurang tidur=4 (bahu)", trapezoid(4, TIDUR.Kurang), 1.0);

console.log("== Batas & luar domain ==");
expect("trap di luar kiri (x=-5)", trapezoid(-5, STRES.Rendah), 0.0);
expect("tri di luar kanan (x=80)", triangle(80, STRES.Sedang), 0.0);
expect("tri di kaki kiri (x=30)", triangle(30, STRES.Sedang), 0.0);

console.log(`\nHasil: ${pass} lulus, ${fail} gagal.`);
if (fail > 0) process.exit(1);
