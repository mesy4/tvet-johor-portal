import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  "Portal": [
    { label: "Laman Utama",      href: "/" },
    { label: "Tentang Kami",     href: "/tentang" },
    { label: "Berita & Sorotan", href: "/berita" },
    { label: "Hubungi Kami",     href: "/hubungi" },
  ],
  "Pengguna": [
    { label: "Pelajar & Belia",    href: "/auth/register/student" },
    { label: "Majikan & Industri", href: "/auth/register/employer" },
    { label: "Pusat Latihan",      href: "/auth/register/provider" },
    { label: "Log Masuk",          href: "/auth/login" },
  ],
  "Direktori": [
    { label: "Peluang Kerja",     href: "/direktori/kerja" },
    { label: "Program Latihan",   href: "/direktori/latihan" },
    { label: "Pusat Latihan",     href: "/direktori/pusat-latihan" },
  ],
  "Dasar": [
    { label: "Polisi Privasi",  href: "/polisi-privasi" },
    { label: "Terma & Syarat",  href: "/terma-syarat" },
    { label: "Penafian",        href: "/penafian" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-johor-navy-900 text-white">
      {/* Top section */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 font-heading font-bold text-sm">
                TVET
              </div>
              <span className="font-heading text-base font-bold">TVET Johor</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Portal rasmi penyelarasan TVET Negeri Johor — menghubungkan bakat,
              industri, dan penyedia latihan.
            </p>
            <div className="mt-5 space-y-1 text-sm text-white/50">
              <p>📞 +607-000 0000</p>
              <p>✉ info@tvetjohor.gov.my</p>
              <p>📍 ADTEC JTM, Pasir Gudang, Johor</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-white/40">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-johor-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Bottom bar */}
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/40 sm:flex-row">
        <p>
          © {new Date().getFullYear()} Laman Web TVET Negeri Johor. Hak Cipta Terpelihara.
        </p>
        <p>
          Dibangunkan oleh ADTEC JTM Kampus Pasir Gudang &amp; Johor Talent Development Council
        </p>
      </div>
    </footer>
  );
}
