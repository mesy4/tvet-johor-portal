import Image from "next/image";

// ---------------------------------------------------------------------------
// Partner data – add / remove / reorder as needed.
// Replace `logo` with the actual SVG/PNG path once real logos are available.
// ---------------------------------------------------------------------------
const PARTNERS = [
  {
    name: "Kerajaan Negeri Johor",
    logo: "/images/partners/kerajaan-johor-logo.svg",
  },
  {
    name: "ADTEC JTM Kampus Pasir Gudang",
    logo: "/images/partners/adtec-logo.svg",
  },
  {
    name: "Johor Talent Development Council (JTDC)",
    logo: "/images/partners/jtdc-logo.svg",
  },
  {
    name: "Jabatan Tenaga Manusia (JTM)",
    logo: "/images/partners/jtm-logo.svg",
  },
  {
    name: "Jabatan Pembangunan Kemahiran (JPK)",
    logo: "/images/partners/jpk-logo.svg",
  },
] as const;

// Duplicate the array so the marquee can loop seamlessly.
const SCROLLING_LIST = [...PARTNERS, ...PARTNERS];

// ---------------------------------------------------------------------------
// Best‑practice Partners / "Rakan Strategik" section
// ---------------------------------------------------------------------------
export function PartnersSection() {
  return (
    <section
      className="overflow-hidden bg-white py-16"
      aria-labelledby="partners-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-red-500">
            Rakan Strategik
          </p>
          <h2
            id="partners-heading"
            className="font-heading text-3xl font-bold text-johor-navy-700 sm:text-4xl"
          >
            Dipercayai Oleh
          </h2>
          <p className="mt-3 text-gray-500">
            Organisasi dan agensi yang bekerjasama dalam ekosistem TVET Johor.
          </p>
        </div>

        {/* ---- Desktop / tablet: static grid ---- */}
        <ul
          className="hidden flex-wrap items-center justify-center gap-8 sm:flex"
          role="list"
        >
          {PARTNERS.map((partner) => (
            <li
              key={partner.name}
              className="group flex h-24 w-44 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm transition-all hover:border-johor-gold/40 hover:shadow-md"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={64}
                className="max-h-16 w-auto object-contain opacity-70 transition-opacity group-hover:opacity-100"
                loading="lazy"
                // Graceful fallback – Next.js will show alt text if image fails
              />
            </li>
          ))}
        </ul>

        {/* ---- Mobile: infinite marquee (CSS only, no JS) ---- */}
        <div className="relative overflow-hidden sm:hidden" aria-hidden="true">
          <ul className="flex w-max animate-partners-scroll gap-6" role="list">
            {SCROLLING_LIST.map((partner, idx) => (
              <li
                key={`${partner.name}-${idx}`}
                className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-3 shadow-sm"
                title={partner.name}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={48}
                  className="max-h-12 w-auto object-contain opacity-70"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>

          {/* Gradient fades on edges for a polished look */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}