import { requireRole }          from "@/lib/session";
import { prisma }               from "@/lib/prisma";
import { StatCard }             from "@/components/dashboard/stat-card";
import { DocumentStatusBadge }  from "@/components/upload/document-status-badge";
import { Badge }                from "@/components/ui/badge";
import { formatDate }           from "@/lib/utils";
import Link                     from "next/link";
import { Briefcase, Users, FileText, PlusCircle, Eye } from "lucide-react";
import type { Metadata }         from "next";

export const metadata: Metadata = { title: "Papan Pemuka Majikan" };

export default async function EmployerDashboardPage() {
  const session = await requireRole("EMPLOYER");

  const profile = await prisma.employerProfile.findUnique({
    where:  { userId: session.user.id },
    select: { id: true, companyName: true, isVerified: true },
  });

  if (!profile) return null;

  const [totalVacancies, totalApplications, pendingDocs, recentVacancies] =
    await Promise.all([
      prisma.vacancy.count({ where: { employerProfileId: profile.id } }),
      prisma.application.count({
        where: { vacancy: { employerProfileId: profile.id } },
      }),
      prisma.document.count({
        where: {
          uploaderId: session.user.id,
          status:     { in: ["PENDING_REVIEW", "REQUIRES_REVISION"] },
        },
      }),
      prisma.vacancy.findMany({
        where:   { employerProfileId: profile.id },
        orderBy: { createdAt: "desc" },
        take:    5,
        select: {
          id: true, title: true, status: true, vacancyType: true,
          location: true, createdAt: true,
          _count: { select: { applications: true } },
        },
      }),
    ]);

  const STATUS_COLORS: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT:     "bg-gray-100 text-gray-600",
    CLOSED:    "bg-red-100 text-red-700",
    ARCHIVED:  "bg-gray-100 text-gray-500",
  };
  const STATUS_LABELS: Record<string, string> = {
    PUBLISHED: "Disiarkan", DRAFT: "Draf", CLOSED: "Ditutup", ARCHIVED: "Diarkib",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Selamat Datang, {profile.companyName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Urus iklan kerja dan semak pemohon anda</p>
        </div>
        <Link
          href="/dashboard/employer/vacancies/new"
          className="hidden sm:flex items-center gap-2 rounded-xl bg-johor-navy-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-johor-navy-600"
        >
          <PlusCircle className="h-4 w-4" />
          Siar Iklan Baru
        </Link>
      </div>

      {/* Verification warning */}
      {!profile.isVerified && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Pengesahan Syarikat Diperlukan</p>
            <p className="mt-0.5 text-sm text-amber-700">
              Muat naik dokumen SSM dan MOF untuk mengaktifkan iklan kerja.{" "}
              <Link href="/dashboard/employer/documents" className="underline font-medium">
                Muat naik sekarang →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Jumlah Iklan"      value={totalVacancies}   icon={Briefcase} accent="navy" />
        <StatCard title="Jumlah Pemohon"    value={totalApplications} icon={Users}    accent="green" />
        <StatCard title="Dokumen Menunggu"  value={pendingDocs}      icon={FileText}  accent="amber" subtitle="Perlu tindakan" />
      </div>

      {/* Vacancy list */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-gray-800">Iklan Kerja Terkini</h2>
          <Link href="/dashboard/employer/vacancies" className="text-xs text-johor-navy-600 hover:underline">
            Lihat semua →
          </Link>
        </div>

        {recentVacancies.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Briefcase className="h-10 w-10 text-gray-200" />
            <p className="text-sm text-gray-400">Belum ada iklan kerja.</p>
            <Link
              href="/dashboard/employer/vacancies/new"
              className="mt-1 rounded-lg bg-johor-navy-500 px-4 py-2 text-sm font-medium text-white hover:bg-johor-navy-600"
            >
              Siar Iklan Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4">Tajuk</th>
                  <th className="pb-3 pr-4 hidden md:table-cell">Jenis</th>
                  <th className="pb-3 pr-4 hidden lg:table-cell">Lokasi</th>
                  <th className="pb-3 pr-4">Pemohon</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentVacancies.map((vac) => (
                  <tr key={vac.id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-800 line-clamp-1">{vac.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(vac.createdAt)}</p>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell text-gray-500">{vac.vacancyType}</td>
                    <td className="py-3 pr-4 hidden lg:table-cell text-gray-500">{vac.location}</td>
                    <td className="py-3 pr-4 font-semibold text-gray-700">{vac._count.applications}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[vac.status] ?? ""}`}>
                        {STATUS_LABELS[vac.status] ?? vac.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/dashboard/employer/vacancies/${vac.id}`}
                        className="text-johor-navy-600 hover:underline"
                        aria-label={`Lihat ${vac.title}`}
                      >
                        <Eye className="h-4 w-4" />
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
