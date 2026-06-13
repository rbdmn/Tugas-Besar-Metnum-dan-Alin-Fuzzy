"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll reveal: konten fade + slide-up sekali saat masuk viewport
 * (PRD Desain Visual Bagian 6). Menghormati prefers-reduced-motion —
 * bila aktif, konten langsung tampil tanpa animasi.
 */
interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Penundaan animasi (ms) untuk efek bertahap antar elemen. */
  delay?: number;
}

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion → tampilkan langsung, lewati observer & animasi.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect(); // sekali per elemen
          }
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className ?? ""}`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
