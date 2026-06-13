"use client";

/**
 * Overlay proses perhitungan (PRD 4.4 / 3.3) — versi tegas tanpa glow.
 * Panel berbingkai tipis dengan bar progres indeterminate singkat (<1 detik).
 */
export default function ProcessOverlay() {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="w-72 border border-border-default bg-surface">
        <div className="flex items-center justify-between border-b border-border-default px-4 py-2">
          <span className="eyebrow text-text-secondary">Memproses</span>
          <span className="font-mono text-xs text-accent">fuzzy mamdani</span>
        </div>
        <div className="px-4 py-5">
          <div className="h-1 w-full overflow-hidden bg-border-default">
            <div className="animate-progress h-full w-1/3 bg-accent" />
          </div>
          <p className="mt-3 font-mono text-[11px] text-text-muted">
            fuzzifikasi → inferensi → agregasi → defuzzifikasi
          </p>
        </div>
      </div>
    </div>
  );
}
