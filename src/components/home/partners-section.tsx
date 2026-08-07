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
// Partners / "Rakan Strategik" — Johor-themed infinite CSS carousel
// ---------------------------------------------------------------------------
export function PartnersSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-johor-navy-900 via-johor-navy-800 to-johor-navy-700 py-16"
      aria-labelledby="partners-heading"
    >
      {/* Decorative blobs (matching hero-section pattern) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-johor-red-500/10 blur-3xl" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-johor-gold/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Section heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-gold">
            Rakan Strategik
          </p>
          <h2
            id="partners-heading"
            className="font-heading text-3xl font-bold text-white sm:text-4xl"
          >
            Dipercayai Oleh
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-johor-red-500" />
          <p className="mt-4 text-white/60">
            Organisasi dan agensi yang bekerjasama dalam ekosistem TVET Johor.
          </p>
        </div>

        {/* Infinite marquee carousel */}
        <div className="relative overflow-hidden">
          <ul
            className="flex w-max animate-partners-scroll gap-6 sm:gap-10"
            role="list"
          >
            {SCROLLING_LIST.map((partner, idx) => (
              <li
                key={`${partner.name}-${idx}`}
                className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm p-3 transition-all hover:border-johor-gold/40 hover:bg-white/20 hover:shadow-lg sm:h-24 sm:w-44"
                title={partner.name}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={64}
                  className="max-h-12 w-auto object-contain brightness-0 invert opacity-70 transition-opacity hover:opacity-100 sm:max-h-16"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>

          {/* Gradient fades on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-johor-navy-900 to-transparent sm:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-johor-navy-900 to-transparent sm:w-12" />
        </div>
      </div>
    </section>
  );
}