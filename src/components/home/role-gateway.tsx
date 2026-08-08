import Link from "next/link";
import { ArrowRight, GraduationCap, Building2, BookOpen, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    icon:        GraduationCap,
    title:       "Pelajar & Belia",
    description: "Cari peluang pekerjaan, mohon latihan industri, dan bina profil kemahiran anda.",
    href:        "/auth/register/student",
    cta:         "Daftar sebagai Pelajar",
    accent:      "from-blue-500 to-johor-navy-500",
    border:      "hover:border-johor-navy-300",
    iconBg:      "bg-johor-navy-50 text-johor-navy-600",
    features:    ["Mohon kerja & latihan industri", "Muat naik Resume & Surat Mohon", "Jejak status permohonan"],
  },
  {
    icon:        Building2,
    title:       "Majikan & Industri",
    description: "Siarkan iklan kerja, semak profil calon, dan lakukan pengesahan syarikat.",
    href:        "/auth/register/employer",
    cta:         "Daftar sebagai Majikan",
    accent:      "from-johor-red-500 to-rose-600",
    border:      "hover:border-johor-red-200",
    iconBg:      "bg-red-50 text-johor-red-600",
    features:    ["Siarkan iklan kekosongan", "Semak & urus calon", "Pengesahan SSM & MOF"],
  },
  {
    icon:        BookOpen,
    title:       "Pusat Latihan",
    description: "Daftarkan program latihan, iklan kerja ADTEC, dan jejak peserta yang mendaftar.",
    href:        "/auth/register/provider",
    cta:         "Daftar Institusi",
    accent:      "from-emerald-500 to-teal-600",
    border:      "hover:border-emerald-200",
    iconBg:      "bg-emerald-50 text-emerald-600",
    features:    ["Siar program latihan", "Urus pendaftaran peserta", "Iklan kerja ADTEC"],
  },
  {
    icon:        Shield,
    title:       "Pegawai Kerajaan",
    description: "Dashboard eksekutif baca sahaja untuk analitik data TVET negeri Johor.",
    href:        "/auth/login",
    cta:         "Log Masuk sebagai Pegawai",
    accent:      "from-amber-500 to-johor-gold",
    border:      "hover:border-amber-200",
    iconBg:      "bg-amber-50 text-amber-600",
    features:    ["Dashboard analitik TVET", "Laporan & statistik negeri", "Akses baca sahaja"],
  },
];

export function RoleGateway() {
  return (
    <section className="bg-gray-50 py-20" aria-labelledby="role-gateway-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            id="role-gateway-heading"
            className="font-heading text-3xl font-bold text-johor-navy-700 sm:text-4xl"
          >
            Pilih Peranan Anda
          </h2>
          <p className="mt-3 text-gray-500">
            Portal Sekretariat TVET Johor melayani pelbagai pengguna — pilih kategori yang bersesuaian untuk bermula.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.title}
                href={role.href}
                className={cn(
                  "group flex flex-col rounded-2xl border-2 border-transparent bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                  role.border
                )}
              >
                {/* Icon */}
                <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl", role.iconBg)}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Title & desc */}
                <h3 className="font-heading text-lg font-semibold text-gray-900">
                  {role.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                  {role.description}
                </p>

                {/* Feature list */}
                <ul className="mt-4 space-y-1.5">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div
                  className={cn(
                    "mt-6 flex items-center gap-1.5 text-sm font-semibold transition-colors",
                    "text-johor-navy-600 group-hover:text-johor-navy-800"
                  )}
                >
                  {role.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
