/**
 * Data anggota tim pengembang (PRD System Overview 3.1).
 * Nilai placeholder — diisi nanti dengan nama & NIM asli.
 */

export interface TeamMember {
  name: string;
  nim: string;
  role: string;
}

export const teamMembers: readonly TeamMember[] = [
  { name: "Anggota Satu", nim: "0000000001", role: "Fuzzy Engine" },
  { name: "Anggota Dua", nim: "0000000002", role: "Frontend / UI" },
  { name: "Anggota Tiga", nim: "0000000003", role: "Visualisasi" },
  { name: "Anggota Empat", nim: "0000000004", role: "Dokumentasi" },
];

/** Ambil inisial dari nama untuk avatar (maks 2 huruf). */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
