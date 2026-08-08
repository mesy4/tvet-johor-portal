import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MapPin, GraduationCap, Calendar, Clock, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Program Latihan — Sekretariat TVET Negeri Johor",
  description: "Cari program latihan kemahiran TVET terkini di Johor daripada pusat latihan bertauliah.",
};

export const dynamic = "force-dynamic";

export default async function DirektoriLatihanPage() {
  const programs = await prisma.trainingProgram.findMany({
    where: {
      status: { in: ["OPEN_FOR_REGISTRATION", "UPCOMING", "ONGOING"] },
    },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      duration: true,
      mode: true,
      venue: true,
      state: true,
      fee: true,
      isFunded: true,
      fundingBody: true,
      certificationName: true,
      certificationBody: true,
      maxParticipants: true,
      startDate: true,
      endDate: true,
      registrationDeadline: true,
      status: true,
      provider: {
        select: {
          institutionName: true,
          logoUrl: true,
        },
      },
    },
  });

  const modeLabel = (mode: string) => {
    const map: Record<string, string> = {
      FULLY_FACE_TO_FACE: "Bersemuka",
      HYBRID: "Hibrid",
      ONLINE: "Dalam Talian",
    };
    return map[mode] ?? mode;
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      UPCOMING: "Akan Datang",
      OPEN_FOR_REGISTRATION: "Pendaftaran Dibuka",
      ONGOING: "Sedang Berlangsung",
      COMPLETED: "Telah Selesai",
      CANCELLED: "Dibatalkan",
    };
    return map[status] ?? status;
  };

  const statusBadgeColor = (status: string) => {
    const map: Record<string, string> = {
      OPEN_FOR_REGISTRATION: "bg-green-50 text-green-700",
      UPCOMING: "bg-blue-50 text-blue-700",
      ONGOING: "bg-johor-navy-50 text-johor-navy-700",
    };
    return map[status] ?? "bg-gray-100 text-gray-600";
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-red-500">Direktori</p>
          <h1 className="font-heading text-4xl font-bold text-johor-navy-700">Program Latihan</h1>
          <p className="mt-3 text-gray-500">
            Program latihan kemahiran TVET terkini daripada pusat latihan bertauliah di Johor.
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Tiada program latihan buat masa ini. Sila kunjungi semula nanti.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <div
                key={p.id}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-johor-navy-50 text-lg font-bold text-johor-navy-500">
                      {p.provider?.institutionName?.charAt(0) ?? "T"}
                    </div>
                    <p className="text-xs text-gray-400 max-w-[140px] truncate">
                      {p.provider?.institutionName ?? "Pusat Latihan"}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeColor(p.status)}`}>
                    {statusLabel(p.status)}
                  </span>
                </div>

                <h3 className="mb-2 font-heading text-lg font-semibold text-johor-navy-700 line-clamp-2">
                  {p.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-gray-500 line-clamp-2">{p.description}</p>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {modeLabel(p.mode)}
                  </span>
                  {p.isFunded && (
                    <span className="rounded-full bg-johor-gold/20 px-2.5 py-0.5 text-xs font-medium text-johor-navy-700">
                      {p.fundingBody ? `Dibiayai ${p.fundingBody}` : "Dibiayai"}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
                  {p.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-johor-red-500" />
                      {p.venue}, {p.state}
                    </span>
                  )}
                  {p.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-johor-red-500" />
                      {p.duration}
                    </span>
                  )}
                  {p.startDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-johor-red-500" />
                      {formatDate(p.startDate)}
                      {p.endDate && ` – ${formatDate(p.endDate)}`}
                    </span>
                  )}
                  {p.maxParticipants && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-johor-red-500" />
                      Maks. {p.maxParticipants} peserta
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