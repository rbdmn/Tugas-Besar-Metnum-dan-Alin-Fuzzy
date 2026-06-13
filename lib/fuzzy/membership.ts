/**
 * Fungsi keanggotaan (membership functions) untuk mesin fuzzy Mamdani.
 *
 * Mengembalikan derajat keanggotaan dalam [0, 1].
 * Lihat PRD System Overview Bagian 4.1–4.2 untuk parameter himpunan.
 */

import type {
  FuzzySet,
  MembershipShape,
  TriangleParams,
  TrapezoidParams,
} from "./types";

/**
 * Fungsi keanggotaan segitiga.
 *
 * Bentuk: naik linear dari a→b, turun linear dari b→c.
 *   μ(x) = 0                      jika x <= a atau x >= c
 *   μ(x) = (x - a) / (b - a)      jika a < x <= b
 *   μ(x) = (c - x) / (c - b)      jika b < x < c
 *
 * Kasus khusus: bila a == b atau b == c (kaki vertikal), sisi tsb. dianggap tegak.
 */
export function triangle(x: number, [a, b, c]: TriangleParams): number {
  if (x < a || x > c) return 0;
  if (x === b) return 1;
  if (x < b) {
    // sisi naik; a === b berarti tegak → langsung 1
    return a === b ? 1 : (x - a) / (b - a);
  }
  // sisi turun; b === c berarti tegak → langsung 1
  return b === c ? 1 : (c - x) / (c - b);
}

/**
 * Fungsi keanggotaan trapesium.
 *
 * Bentuk: naik a→b, plateau (=1) b→c, turun c→d.
 *   μ(x) = 0                      jika x <= a atau x >= d
 *   μ(x) = (x - a) / (b - a)      jika a < x < b
 *   μ(x) = 1                      jika b <= x <= c
 *   μ(x) = (d - x) / (d - c)      jika c < x < d
 *
 * Kasus khusus: a == b (bahu kiri tegak, mis. [0,0,...]) atau c == d
 * (bahu kanan tegak, mis. [...,100,100]) ditangani agar tidak membagi nol.
 */
export function trapezoid(x: number, [a, b, c, d]: TrapezoidParams): number {
  if (x < a || x > d) return 0;
  // Plateau (b..c) dicek lebih dulu agar bahu tegak di tepi domain
  // (mis. [0,0,..] atau [..,100,100]) bernilai 1 pada batasnya.
  if (x >= b && x <= c) return 1;
  if (x < b) {
    return a === b ? 1 : (x - a) / (b - a);
  }
  // x > c
  return c === d ? 1 : (d - x) / (d - c);
}

/**
 * Evaluasi derajat keanggotaan untuk bentuk apa pun berdasarkan parameter.
 * Dipakai sebagai dispatcher generik.
 */
export function membership(
  x: number,
  shape: MembershipShape,
  params: TriangleParams | TrapezoidParams,
): number {
  return shape === "triangle"
    ? triangle(x, params as TriangleParams)
    : trapezoid(x, params as TrapezoidParams);
}

/** Evaluasi derajat keanggotaan suatu nilai terhadap sebuah FuzzySet. */
export function membershipOf(x: number, set: FuzzySet): number {
  return set.shape === "triangle"
    ? triangle(x, set.params)
    : trapezoid(x, set.params);
}
