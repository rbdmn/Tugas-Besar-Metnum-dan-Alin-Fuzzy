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

/**
 * Tahap 1 — Fuzzifikasi satu variabel input:
 * nilai mentah + derajat keanggotaan ke tiap himpunan.
 */
export interface FuzzificationDetail {
  /** Nilai input mentah (mis. skor stres 0–100, jam tidur 0–12). */
  input: number;
  /** Derajat keanggotaan ke tiap himpunan (Rendah/Sedang/Tinggi). */
  degrees: MembershipDegrees;
}

/**
 * Tahap 2 — Aktivasi sebuah rule pada inferensi (untuk ditampilkan ke pengguna).
 */
export interface RuleActivation {
  /** Nomor rule sesuai urutan basis aturan (1..9). */
  id: number;
  /** Antiseden: label himpunan Stres. */
  stres: FuzzyLabel;
  /** Antiseden: label himpunan Jam Tidur (Rendah/Sedang/Tinggi = Kurang/Cukup/Banyak). */
  tidur: FuzzyLabel;
  /** Konsekuen: label himpunan output Risiko. */
  output: FuzzyLabel;
  /** Derajat keanggotaan antiseden stres. */
  stresDegree: number;
  /** Derajat keanggotaan antiseden tidur. */
  tidurDegree: number;
  /** Derajat aktivasi rule, α = min(stresDegree, tidurDegree). */
  alpha: number;
}

/** Jejak lengkap tiap tahap pipeline Mamdani untuk dirender di UI. */
export interface MamdaniTrace {
  /** Tahap 1 — Fuzzifikasi: input mentah + derajat keanggotaan tiap variabel. */
  fuzzification: {
    stres: FuzzificationDetail;
    tidur: FuzzificationDetail;
  };
  /** Tahap 2 — Inferensi: aktivasi seluruh 9 rule (rule aktif bila alpha > 0). */
  activations: RuleActivation[];
  /** Tahap 3 — Agregasi: α maksimum per himpunan output. */
  aggregated: MembershipDegrees;
  /** Tahap 4 — Defuzzifikasi (centroid). */
  defuzzification: {
    /** Skor risiko hasil centroid (z*), 0–100. */
    score: number;
    /** Kategori risiko terpetakan dari skor. */
    category: RiskCategory;
  };
}

/** Hasil akhir pipeline Mamdani: skor & kategori + jejak tiap tahap. */
export interface FuzzyResult {
  /** Skor risiko hasil defuzzifikasi (centroid), 0–100. */
  score: number;
  /** Kategori risiko terpetakan dari skor. */
  category: RiskCategory;
  /** Jejak tiap tahap untuk transparansi/visualisasi proses. */
  trace: MamdaniTrace;
}
