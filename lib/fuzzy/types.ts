/**
 * Tipe data inti untuk mesin fuzzy Mamdani.
 * Mengacu pada PRD System Overview Bagian 4.
 */

/** Label kategori yang dipakai untuk himpunan input/output (3 tingkat). */
export type FuzzyLabel = "Rendah" | "Sedang" | "Tinggi";

/** Bentuk fungsi keanggotaan yang didukung. */
export type MembershipShape = "triangle" | "trapezoid";

/**
 * Parameter fungsi keanggotaan.
 * - Segitiga: [a, b, c]  (kaki kiri, puncak, kaki kanan)
 * - Trapesium: [a, b, c, d] (kaki kiri, bahu kiri, bahu kanan, kaki kanan)
 */
export type TriangleParams = readonly [number, number, number];
export type TrapezoidParams = readonly [number, number, number, number];

/**
 * Definisi sebuah himpunan fuzzy: nama label + bentuk + parameter.
 * Memakai discriminated union agar parameter cocok dengan bentuknya.
 */
export type FuzzySet =
  | { label: FuzzyLabel; shape: "triangle"; params: TriangleParams }
  | { label: FuzzyLabel; shape: "trapezoid"; params: TrapezoidParams };

/**
 * Variabel fuzzy (linguistik): punya rentang semesta (domain) dan
 * kumpulan himpunan fuzzy yang mendefinisikannya.
 */
export interface FuzzyVariable {
  name: string;
  /** Rentang nilai variabel, mis. [0, 100] untuk stres/risiko, [0, 12] untuk tidur. */
  range: readonly [number, number];
  sets: readonly FuzzySet[];
}

/** Hasil fuzzifikasi: derajat keanggotaan satu nilai ke tiap label himpunan. */
export type MembershipDegrees = Record<FuzzyLabel, number>;

/** Kategori akhir hasil penilaian risiko. */
export type RiskCategory = FuzzyLabel;

/** Hasil akhir pipeline Mamdani (akan diisi pada tahap berikutnya). */
export interface FuzzyResult {
  /** Skor risiko hasil defuzzifikasi (centroid), 0–100. */
  score: number;
  /** Kategori risiko terpetakan dari skor. */
  category: RiskCategory;
}
