import { requireRole }  from "@/lib/session";
import { prisma }       from "@/lib/prisma";
import { StatCard }     from "@/components/dashboard/stat-card";
import { formatDate }   from "@/lib/utils";
import Link             from "next/link";
import { BookOpen, Users, Briefcase, PlusCircle, Eye } from "lucide-react";
import type { Metadata }  from "next";

export const metadata: Metadata = { title: "Papan Pemuka Pusat Latihan" };

const TRAINING_STATUS_LABELS: Record<string, string> = {
  UPCOMING:              "Akan Datang",
  OPEN_FOR_REGISTRATION: "Buka Pendaftaran",
  ONGOING:               "Sedang Berjalan",
  COMPLETED:             "Selesai",
  CANCELLED:             "Dibatalkan",
};
const TRAINING_STATUS_COLORS: Record<string, string> = {
  UPCOMING:              "bg-blue-100 text-blue-700",
  OPEN_FOR_REGISTRATION: "bg-green-100 text-green-700",
  ONGOING:               "bg-amber-100 text-amber-700",
  COMPLETED:             "bg-gray-100 text-gray-600",
  CANCELLED:             "bg-red-100 text-red-700",
};

export default async function ProviderDashboardPage() {
  const session = await requireRole("PROVIDER");

  const profile = await prisma.providerProfile.findUnique({
    where:  { userId: session.user.id },
    select: { id: true, institutionName: true, isVerified: true },
  });
  if (!profile) return null;

  const [totalPrograms, totalEnrollments, activeVacancies, recentPrograms] =
    await Promise.all([
      prisma.trainingProgram.count({ where: { providerId: profile.id } }),
      prisma.enrollment.count({ where: { program: { providerId: profile.id } } }),
      prisma.vacancy.count({ where: { providerProfileId: profile.id, status: "PUBLISHED" } }),
      prisma.trainingProgram.findMany({
        where:   { providerId: profile.id },
        orderBy: { createdAt: "desc" },
        take:    5,
        select: {
          id: true, title: true, status: true, mode: true, startDate: true,
          _count: { select: { enrollments: true } },
        },
      }),
    ]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">{profile.institutionName}</h1>
          <p className="mt-1 text-sm text-gray-500">Urus program latihan dan peserta</p>
        </div>
        <Link
          href="/dashboard/provider/programs/new"
          className="hidden sm:flex items-center gap-2 rounded-xl bg-johor-navy-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-johor-navy-600"
        >
          <PlusCircle className="h-4 w-4" />
          Program Baru
        </Link>
      </div>

      {!profile.isVerified && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          ⚠️ Institusi belum disahkan. Hubungi admin untuk proses pengesahan.
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Program Latihan"  value={totalPrograms}    icon={BookOpen}  accent="navy" />
        <StatCard title="Jumlah Peserta"   value={totalEnrollments} icon={Users}     accent="green" />
        <StatCard title="Iklan Kerja Aktif" value={activeVacancies} icon={Briefcase} accent="amber" />
      </div>

      {/* Programs table */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-gray-800">Program Latihan Terkini</h2>
          <Link href="/dashboard/provider/programs" className="text-xs text-johor-navy-600 hover:underline">
            Lihat semua →
          </Link>
        </div>
        {recentPrograms.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <BookOpen className="h-10 w-10 text-gray-200" />
            <p className="text-sm text-gray-400">Belum ada program latihan.</p>
            <Link
              href="/dashboard/provider/programs/new"
              className="rounded-lg bg-johor-navy-500 px-4 py-2 text-sm font-medium text-white hover:bg-johor-navy-600"
            >
              Cipta Program Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4">Program</th>
                  <th className="pb-3 pr-4 hidden md:table-cell">Mod</th>
                  <th className="pb-3 pr-4 hidden lg:table-cell">Tarikh Mula</th>
                  <th className="pb-3 pr-4">Peserta</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentPrograms.map((prog) => (
                  <tr key={prog.id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-800 line-clamp-1">{prog.title}</p>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell text-gray-500 text-xs">{prog.mode.replace(/_/g, " ")}</td>
                    <td className="py-3 pr-4 hidden lg:table-cell text-gray-500">
                      {prog.startDate ? formatDate(prog.startDate) : "—"}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-gray-700">{prog._count.enrollments}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TRAINING_STATUS_COLORS[prog.status] ?? ""}`}>
                        {TRAINING_STATUS_LABELS[prog.status] ?? prog.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link href={`/dashboard/provider/programs/${prog.id}`} aria-label={`Lihat ${prog.title}`}>
                        <Eye className="h-4 w-4 text-johor-navy-600" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
