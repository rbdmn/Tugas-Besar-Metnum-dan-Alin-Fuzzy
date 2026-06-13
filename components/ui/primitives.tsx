import type { ReactNode } from "react";

/**
 * Primitives visual bersama agar gaya "padat & tegas" konsisten di semua
 * komponen (lihat referensi PERT). Border tipis, label uppercase, tanpa glow.
 */

/** Label kecil uppercase (eyebrow / penanda seksi atau metrik). */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/** Panel berbingkai tipis tanpa glow. */
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-border-default bg-surface ${className}`}
    >
      {children}
    </div>
  );
}

/** Header bar seksi: ikon/label kiri, meta kanan, dengan garis bawah. */
export function PanelHeader({
  label,
  meta,
}: {
  label: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
      <span className="eyebrow flex items-center gap-2 text-text-secondary">
        {label}
      </span>
      {meta != null && (
        <span className="font-mono text-xs text-text-muted">{meta}</span>
      )}
    </div>
  );
}

/** Sel metrik: label uppercase kecil + angka besar mono + caption opsional. */
export function StatCell({
  label,
  value,
  caption,
  accent,
  className = "",
}: {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  /** Warna aksen untuk titik penanda & angka (warna = makna). */
  accent?: string;
  className?: string;
}) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      <div className="flex items-center gap-2">
        {accent && (
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
        )}
        <span className="eyebrow">{label}</span>
      </div>
      <p
        className="stat-num mt-2 text-3xl"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {caption != null && (
        <p className="mt-1 text-xs text-text-muted">{caption}</p>
      )}
    </div>
  );
}
