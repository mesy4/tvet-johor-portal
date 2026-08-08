import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MapPin, Briefcase, Clock, Banknote } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carian Peluang Kerja — TVET Negeri Johor",
  description: "Cari peluang pekerjaan dan jawatan kosong terkini di Johor untuk graduan TVET.",
};

export const dynamic = "force-dynamic";

export default async function DirektoriKerjaPage() {
  const vacancies = await prisma.vacancy.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      vacancyType: true,
      sector: true,
      location: true,
      salaryMin: true,
      salaryMax: true,
      salaryNegotiable: true,
      publishedAt: true,
      applicationDeadline: true,
      employer: {
        select: {
          companyName: true,
          logoUrl: true,
        },
      },
      provider: {
        select: {
          institutionName: true,
          logoUrl: true,
        },
      },
    },
  });

  const vacancyTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      FULL_TIME: "Sepenuh Masa",
      PART_TIME: "Separuh Masa",
      CONTRACT: "Kontrak",
      INTERNSHIP: "Latihan Industri",
      APPRENTICESHIP: "Perantisan",
      FREELANCE: "Freelance",
    };
    return map[type] ?? type;
  };

  const sectorLabel = (sector: string) => {
    const map: Record<string, string> = {
      MANUFACTURING: "Pembuatan",
      CONSTRUCTION: "Pembinaan",
      SERVICES: "Perkhidmatan",
      TECHNOLOGY: "Teknologi",
      AGRICULTURE: "Pertanian",
      HOSPITALITY: "Hospitaliti",
      HEALTHCARE: "Penjagaan Kesihatan",
      LOGISTICS: "Logistik",
      ENERGY: "Tenaga",
      EDUCATION: "Pendidikan",
      GOVERNMENT: "Kerajaan",
      OTHER: "Lain-lain",
    };
    return map[sector] ?? sector;
  };

  const companyName = (v: typeof vacancies[number]) => {
    return v.employer?.companyName ?? v.provider?.institutionName ?? "—";
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-red-500">Direktori</p>
          <h1 className="font-heading text-4xl font-bold text-johor-navy-700">Carian Peluang Kerja</h1>
          <p className="mt-3 text-gray-500">
            Jawatan kosong terkini di Johor untuk graduan TVET dan pekerja berkemahiran.
          </p>
        </div>

        {vacancies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Tiada peluang kerja buat masa ini. Sila kunjungi semula nanti.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vacancies.map((v) => (
              <div
                key={v.id}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-johor-navy-50 text-lg font-bold text-johor-navy-500">
                    {companyName(v).charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{companyName(v)}</p>
                  </div>
                </div>

                <h3 className="mb-2 font-heading text-lg font-semibold text-johor-navy-700 line-clamp-2">
                  {v.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-gray-500 line-clamp-2">{v.description}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-johor-navy-50 px-2.5 py-0.5 text-xs font-medium text-johor-navy-600">
                    {vacancyTypeLabel(v.vacancyType)}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {sectorLabel(v.sector)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-johor-red-500" />
                    {v.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Banknote className="h-3.5 w-3.5 text-johor-red-500" />
                    {v.salaryNegotiable
                      ? "Gaji boleh runding"
                      : v.salaryMin && v.salaryMax
                        ? `RM ${v.salaryMin.toLocaleString()} – RM ${v.salaryMax.toLocaleString()}`
                        : v.salaryMin
                          ? `Bermula RM ${v.salaryMin.toLocaleString()}`
                          : "Gaji tidak dinyatakan"}
                  </span>
                  {v.applicationDeadline && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-johor-red-500" />
                      Tarikh tutup: {formatDate(v.applicationDeadline)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}