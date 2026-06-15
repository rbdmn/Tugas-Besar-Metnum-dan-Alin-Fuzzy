import { teamMembers } from "@/lib/team";
import { Eyebrow } from "@/components/ui/primitives";

/**
 * Section 1 — Landing (PRD System Overview 3.1, PRD Desain 4.2).
 * Layout dua kolom: judul besar di kiri, panel info + tim di kanan (gaya PERT).
 * Tanpa ambient gradient/glow; hierarki tipografi tegas.
 */

const categories = [
  {
    key: "R",
    label: "Rendah",
    desc: "Kondisi terkendali, risiko minim.",
    color: "var(--risk-rendah)",
  },
  {
    key: "S",
    label: "Sedang",
    desc: "Perlu perhatian & manajemen stres.",
    color: "var(--risk-sedang)",
  },
  {
    key: "T",
    label: "Tinggi",
    desc: "Disarankan mencari dukungan lebih.",
    color: "var(--risk-tinggi)",
  },
];

export default function Landing() {
  return (
    <section id="pengantar" aria-labelledby="pengantar-heading">
      <div className="panel-shadow mx-auto grid max-w-content grid-cols-1 gap-px border border-accent-3/60 lg:grid-cols-12">
        {/* Kolom kiri — judul & CTA */}
        <div className="lg:col-span-7 px-6 py-10 sm:px-8">
          <Eyebrow className="text-accent">
            Metode Numerik · Fuzzy Mamdani
          </Eyebrow>

          <h1
            id="pengantar-heading"
            className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl"
          >
            Penilaian Risiko{" "}
            <span className="text-accent">Kesehatan Mental</span>
          </h1>

          <p className="mt-4 max-w-md text-sm text-text-secondary sm:text-base">
            Ukur tingkat risiko dari stres &amp; pola tidur menggunakan logika
            fuzzy metode Mamdani.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="#kuisioner"
              className="bg-accent px-6 py-3 font-display text-sm font-semibold text-[var(--bg-base)] transition-colors hover:bg-accent-2"
            >
              Mulai Kuisioner →
            </a>
            <span className="font-mono text-xs text-text-muted">
              10 soal · ±1 menit
            </span>
          </div>
        </div>

        {/* Kolom kanan — panel info & tim */}
        <aside className="lg:col-span-5 border-t border-border-default bg-surface lg:border-l lg:border-t-0">
          <div className="border-b border-border-default px-6 py-4">
            <Eyebrow>Anggota Kelompok 3</Eyebrow>
          </div>
          <ul>
            {teamMembers.map((m) => (
              <li
                key={m.nim}
                className="flex items-center justify-between border-b border-border-default px-6 py-3"
              >
                <div>
                  <p className="font-semibold leading-tight text-text-primary">
                    {m.name}
                  </p>
                  <p className="font-mono text-xs text-text-muted">{m.nim}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Legend kategori risiko — warna = makna (gaya legenda O/M/P) */}
      <div className="panel-shadow mx-auto mt-4 grid max-w-content grid-cols-1 border border-accent-3/60 bg-surface sm:grid-cols-3">
        {categories.map((c, i) => (
          <div
            key={c.key}
            className={`flex gap-3 px-6 py-4 ${
              i > 0
                ? "border-t border-border-default sm:border-l sm:border-t-0"
                : ""
            }`}
          >
            <span
              aria-hidden
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-[var(--bg-base)]"
              style={{ backgroundColor: c.color }}
            >
              {c.key}
            </span>
            <div>
              <p className="font-semibold leading-tight text-text-primary">
                Risiko {c.label}
              </p>
              <p className="text-xs text-text-muted">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
