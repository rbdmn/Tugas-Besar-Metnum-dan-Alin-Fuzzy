/**
 * Data anggota tim pengembang (PRD System Overview 3.1).
 * Nilai placeholder — diisi nanti dengan nama & NIM asli.
 */

export interface TeamMember {
  name: string;
  nim: string;
}

export const teamMembers: readonly TeamMember[] = [
  { name: "Abdurrahman Rauf Budiman", nim: "2301102"},
  { name: "Faiz Bayu Erlangga", nim: "2311231"},
  { name: "Marco Henrik Abineno", nim: "2301093"},
  { name: "Muhammad Alvinza", nim: "2304879"},
  { name: "Naufal Fakhri Al-Najieb", nim: "2309648"},
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
