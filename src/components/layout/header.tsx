"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Laman Utama",  href: "/" },
  {
    label: "Direktori",
    href: "#",
    children: [
      { label: "Carian Peluang Kerja",   href: "/direktori/kerja" },
      { label: "Program Latihan",        href: "/direktori/latihan" },
      { label: "Pusat Latihan",          href: "/direktori/pusat-latihan" },
    ],
  },
  { label: "Berita & Sorotan", href: "/berita" },
  { label: "Tentang Kami",     href: "/tentang" },
  { label: "Hubungi Kami",     href: "/hubungi" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-300",
        scrolled
          ? "bg-white/95 shadow-md backdrop-blur-md"
          : "bg-johor-navy-500"
      )}
    >
      {/* ── Top bar — branding strip ─────────────────────── */}
      <div className={cn(
        "hidden border-b py-1 text-xs lg:block",
        scrolled ? "border-gray-100 bg-gray-50 text-gray-500" : "border-white/10 bg-johor-navy-700 text-white/70"
      )}>
        <div className="container mx-auto flex items-center justify-between px-4">
          <span>Portal Rasmi TVET Negeri Johor | ADTEC JTM Kampus Pasir Gudang &amp; JTDC</span>
          <span>📞 +607-000 0000 &nbsp;|&nbsp; ✉ info@tvetjohor.gov.my</span>
        </div>
      </div>

      {/* ── Main nav ─────────────────────────────────────── */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="Laman Utama TVET Johor">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg font-heading font-bold text-sm",
            scrolled
              ? "bg-johor-navy-500 text-white"
              : "bg-white/15 text-white"
          )}>
            TVET
          </div>
          <div className="hidden sm:block">
            <p className={cn(
              "font-heading text-base font-bold leading-tight",
              scrolled ? "text-johor-navy-500" : "text-white"
            )}>
              TVET Negeri Johor
            </p>
            <p className={cn(
              "text-xs leading-tight",
              scrolled ? "text-gray-500" : "text-white/70"
            )}>
              ADTEC Pasir Gudang · JTDC
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === link.label ? null : link.label)
                  }
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    scrolled
                      ? "text-gray-700 hover:bg-gray-100 hover:text-johor-navy-500"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  )}
                  aria-expanded={openDropdown === link.label}
                  aria-haspopup="true"
                >
                  {link.label}
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform", openDropdown === link.label && "rotate-180")}
                  />
                </button>
                {openDropdown === link.label && (
                  <div className="absolute left-0 top-full mt-1 min-w-52 rounded-xl border bg-white p-1.5 shadow-lg">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-johor-navy-50 hover:text-johor-navy-500"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? scrolled
                      ? "bg-johor-navy-50 text-johor-navy-500 font-semibold"
                      : "bg-white/15 text-white font-semibold"
                    : scrolled
                    ? "text-gray-700 hover:bg-gray-100 hover:text-johor-navy-500"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm" className={scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}>
            <Link href="/auth/login">Log Masuk</Link>
          </Button>
          <Button asChild variant={scrolled ? "navy" : "gold"} size="sm">
            <Link href="/auth/register/student">Daftar Sekarang</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            "rounded-lg p-2 lg:hidden",
            scrolled ? "text-gray-700" : "text-white"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* ── Mobile menu ──────────────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-johor-navy-700 px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-5 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium",
                    pathname === link.href
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild variant="ghost" className="w-full justify-center text-white hover:bg-white/10">
              <Link href="/auth/login">Log Masuk</Link>
            </Button>
            <Button asChild variant="gold" className="w-full justify-center">
              <Link href="/auth/register/student">Daftar Sekarang</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
