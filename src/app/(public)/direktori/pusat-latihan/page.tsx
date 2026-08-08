import { prisma } from "@/lib/prisma";
import { MapPin, Building2, Globe, Phone, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Latihan — Sekretariat TVET Negeri Johor",
  description: "Direktori pusat latihan TVET bertauliah di Johor termasuk ADTEC, institut kemahiran, dan penyedia latihan.",
};

export const dynamic = "force-dynamic";

export default async function DirektoriPusatLatihanPage() {
  const providers = await prisma.providerProfile.findMany({
    where: { isVerified: true },
    orderBy: { institutionName: "asc" },
    select: {
      id: true,
      institutionName: true,
      institutionCode: true,
      accreditationBody: true,
      accreditationNo: true,
      address: true,
      city: true,
      state: true,
      postcode: true,
      contactName: true,
      contactPhone: true,
      website: true,
      logoUrl: true,
      description: true,
    },
  });

  const accreditationLabel = (body: string | null) => {
    const map: Record<string, string> = {
      JPK: "Jabatan Pembangunan Kemahiran (JPK)",
      MQA: "Agensi Kelayakan Malaysia (MQA)",
      HRDC: "HRD Corp",
    };
    return body ? (map[body] ?? body) : null;
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-red-500">Direktori</p>
          <h1 className="font-heading text-4xl font-bold text-johor-navy-700">Pusat Latihan</h1>
          <p className="mt-3 text-gray-500">
            Direktori pusat latihan TVET bertauliah di Johor. Cari pusat latihan yang sesuai dengan keperluan kemahiran anda.
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Tiada pusat latihan buat masa ini. Sila kunjungi semula nanti.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((p) => (
              <div
                key={p.id}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-johor-navy-50 text-xl font-bold text-johor-navy-500">
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt={p.institutionName} className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      p.institutionName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-johor-navy-700 line-clamp-2">{p.institutionName}</h3>
                    {p.institutionCode && (
                      <p className="text-xs text-gray-400">{p.institutionCode}</p>
                    )}
                  </div>
                </div>

                {p.description && (
                  <p className="mb-4 flex-1 text-sm text-gray-500 line-clamp-3">{p.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
                  {(p.address || p.city) && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-johor-red-500" />
                      <span className="line-clamp-1">
                        {[p.address, p.city, p.postcode, p.state].filter(Boolean).join(", ")}
                      </span>
                    </span>
                  )}
                  {p.contactPhone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-johor-red-500" />
                      {p.contactPhone}
                      {p.contactName && ` (${p.contactName})`}
                    </span>
                  )}
                  {p.website && (
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 shrink-0 text-johor-red-500" />
                      <a
                        href={p.website.startsWith("http") ? p.website : `https://${p.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-johor-navy-500 hover:text-johor-red-500 transition-colors truncate"
                      >
                        {p.website}
                      </a>
                    </span>
                  )}
                  {p.accreditationBody && (
                    <span className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 shrink-0 text-johor-red-500" />
                      {accreditationLabel(p.accreditationBody)}
                      {p.accreditationNo && ` (${p.accreditationNo})`}
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