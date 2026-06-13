/**
 * Data 10 soal stres untuk kuisioner.
 * Mengacu pada PRD System Overview Bagian 3.2 (Input A).
 *
 * Tampilan memakai skala Likert 1–5 (lingkaran), lalu setiap pilihan dikonversi
 * ke skala 0–10 untuk fuzzy engine. Skor stres = jumlah 10 nilai terkonversi
 * (10 soal × maks 10 = maks 100) → skala 0–100. Engine fuzzy tidak berubah.
 */

export interface StressQuestion {
  /** Nomor urut soal (1–10). */
  id: number;
  /** Teks pertanyaan. */
  text: string;
  /** Label ekstrem kiri (pilihan 1). */
  leftLabel: string;
  /** Label ekstrem kanan (pilihan 5). */
  rightLabel: string;
}

/** Skala pilihan Likert per soal. */
export const CHOICE_MIN = 1;
export const CHOICE_MAX = 5;

/** Nilai maksimum terkonversi per soal (untuk fuzzy engine). */
export const MAX_PER_QUESTION = 10;

/** Jumlah soal stres. */
export const STRESS_QUESTION_COUNT = 10;

/**
 * Konversi pilihan Likert 1–5 → skala 0–10 (linear).
 *   1→0, 2→2.5, 3→5, 4→7.5, 5→10   ⇒  value = (choice - 1) * 2.5
 */
export function choiceToScore(choice: number): number {
  return (choice - CHOICE_MIN) * (MAX_PER_QUESTION / (CHOICE_MAX - CHOICE_MIN));
}

export const stressQuestions: readonly StressQuestion[] = [
  {
    id: 1,
    text: "Seberapa sering kamu merasa kewalahan dengan tugas kuliah?",
    leftLabel: "Tidak pernah",
    rightLabel: "Sangat sering",
  },
  {
    id: 2,
    text: "Seberapa sulit kamu berkonsentrasi saat belajar?",
    leftLabel: "Tidak sulit",
    rightLabel: "Sangat sulit",
  },
  {
    id: 3,
    text: "Seberapa sering kamu merasa cemas tanpa alasan yang jelas?",
    leftLabel: "Tidak pernah",
    rightLabel: "Sangat sering",
  },
  {
    id: 4,
    text: "Seberapa sering kamu merasa tidak punya waktu istirahat?",
    leftLabel: "Tidak pernah",
    rightLabel: "Sangat sering",
  },
  {
    id: 5,
    text: "Seberapa sering kamu merasa lelah meskipun sudah tidur?",
    leftLabel: "Tidak pernah",
    rightLabel: "Sangat sering",
  },
  {
    id: 6,
    text: "Seberapa sulit kamu menikmati hal-hal yang biasanya menyenangkan?",
    leftLabel: "Tidak sulit",
    rightLabel: "Sangat sulit",
  },
  {
    id: 7,
    text: "Seberapa sering kamu merasa tidak mampu memenuhi ekspektasi?",
    leftLabel: "Tidak pernah",
    rightLabel: "Sangat sering",
  },
  {
    id: 8,
    text: "Seberapa sering kamu mengalami sakit kepala atau tegang otot?",
    leftLabel: "Tidak pernah",
    rightLabel: "Sangat sering",
  },
  {
    id: 9,
    text: "Seberapa sering kamu merasa mood kamu berubah-ubah?",
    leftLabel: "Tidak pernah",
    rightLabel: "Sangat sering",
  },
  {
    id: 10,
    text: "Seberapa sering kamu merasa khawatir tentang masa depan?",
    leftLabel: "Tidak pernah",
    rightLabel: "Sangat sering",
  },
];

/** Rentang input jam tidur (PRD Bagian 3.2 Input B). */
export const SLEEP_MIN = 0;
export const SLEEP_MAX = 12;
