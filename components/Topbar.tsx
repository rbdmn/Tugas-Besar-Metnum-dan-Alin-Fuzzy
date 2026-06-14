"use client";

import { useEffect, useState } from "react";

/**
 * Topbar tegas & rata (PRD 4.1, gaya referensi PERT).
 * Garis bawah tipis selalu ada; jadi solid + blur saat scroll. Tanpa glow.
 */
const navLinks = [
  { href: "#pengantar", label: "Pengantar" },
  { href: "#kuisioner", label: "Kuisioner" },
  { href: "#hasil", label: "Hasil" },
];

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border-default transition-colors duration-200 ${
        scrolled ? "bg-ink/85 backdrop-blur-md" : "bg-ink"
      }`}
    >
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-14 max-w-content items-center justify-between px-4 sm:px-6"
      >
        <a
          href="#pengantar"
          className="flex items-baseline gap-2 font-display text-base font-bold tracking-tight text-text-primary"
        >
          <span aria-hidden className="text-accent">
            ◆
          </span>
          Tugas Besar Metode Numerik dan Aljabar Linier
        </a>

        <ul className="flex items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-text-secondary transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
