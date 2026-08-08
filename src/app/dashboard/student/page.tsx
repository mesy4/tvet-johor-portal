import { requireRole }          from "@/lib/session";
import { prisma }               from "@/lib/prisma";
import { StatCard }             from "@/components/dashboard/stat-card";
import { DocumentStatusBadge }  from "@/components/upload/document-status-badge";
import { formatDate }           from "@/lib/utils";
import Link                     from "next/link";
import { ClipboardList, FileText, Search, CheckCircle2 } from "lucide-react";
import type { Metadata }         from "next";

export const metadata: Metadata = { title: "Papan Pemuka Pelajar" };

const APP_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  SUBMITTED:         { label: "Dihantar",          color: "bg-blue-100 text-blue-700" },
  IN_REVIEW:         { label: "Dalam Semakan",     color: "bg-amber-100 text-amber-700" },
  REQUIRES_REVISION: { label: "Pindaan Diperlukan",color: "bg-orange-100 text-orange-700" },
  SHORTLISTED:       { label: "Disenarai Pendek",  color: "bg-purple-100 text-purple-700" },
  APPROVED:          { label: "Diluluskan",        color: "bg-green-100 text-green-700" },
  REJECTED:          { label: "Ditolak",           color: "bg-red-100 text-red-700" },
  WITHDRAWN:         { label: "Ditarik Balik",     color: "bg-gray-100 text-gray-600" },
};

export default async function StudentDashboardPage() {
  const session = await requireRole("STUDENT");

  const profile = await prisma.studentProfile.findUnique({
    where:  { userId: session.user.id },
    select: { id: true, isProfileComplete: true },
  });

  const [totalApplications, approvedApplications, pendingDocs, recentApplications] =
    await Promise.all([
      prisma.application.count({ where: { student: { userId: session.user.id } } }),
      prisma.application.count({ where: { student: { userId: session.user.id }, status: "APPROVED" } }),
      prisma.document.count({
        where: {
          uploaderId: session.user.id,
          status:     { in: ["PENDING_REVIEW", "REQUIRES_REVISION"] },
        },
      }),
      prisma.application.findMany({
        where:   { student: { userId: session.user.id } },
        orderBy: { submittedAt: "desc" },
        take:    5,
        select: {
          id: true, status: true, submittedAt: true, revisionNote: true,
          vacancy: { select: { id: true, title: true, employer: { select: { companyName: true } } } },
        },
      }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Selamat Datang, {session.user.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">Jejak permohonan dan urus dokumen anda</p>
      </div>

      {/* Profile completion nudge */}
      {!profile?.isProfileComplete && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <span className="text-lg">📝</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">Lengkapkan Profil Anda</p>
            <p className="mt-0.5 text-sm text-blue-700">
              Profil yang lengkap meningkatkan peluang anda dilihat oleh majikan.{" "}
              <Link href="/dashboard/student/profile" className="underline font-medium">
                Kemaskini profil →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Jumlah Permohonan"  value={totalApplications}  icon={ClipboardList} accent="navy" />
        <StatCard title="Permohonan Berjaya" value={approvedApplications} icon={CheckCircle2} accent="green" />
        <StatCard title="Dokumen Menunggu"   value={pendingDocs}         icon={FileText}      accent="amber" />
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/direktori/kerja"
          className="flex items-center gap-4 rounded-xl border border-johor-navy-100 bg-johor-navy-50 p-5 transition-colors hover:bg-johor-navy-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-johor-navy-500">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-johor-navy-700">Cari Peluang Kerja</p>
            <p className="text-xs text-johor-navy-500">Semak iklan terkini di Johor</p>
          </div>
        </Link>
        <Link
          href="/dashboard/student/documents"
          className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-johor-red-50">
            <FileText className="h-5 w-5 text-johor-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Muat Naik Resume</p>
            <p className="text-xs text-gray-500">Kemaskini CV & surat mohon</p>
          </div>
        </Link>
      </div>

      {/* Recent applications */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-gray-800">Permohonan Terbaru</h2>
          <Link href="/dashboard/student/applications" className="text-xs text-johor-navy-600 hover:underline">
            Lihat semua →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <ClipboardList className="h-10 w-10 text-gray-200" />
            <p className="text-sm text-gray-400">Belum ada permohonan.</p>
            <Link
              href="/direktori/kerja"
              className="mt-1 rounded-lg bg-johor-navy-500 px-4 py-2 text-sm font-medium text-white hover:bg-johor-navy-600"
            >
              Cari Kerja Sekarang
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentApplications.map((app) => {
              const statusCfg = APP_STATUS_CONFIG[app.status] ?? { label: app.status, color: "bg-gray-100 text-gray-600" };
              return (
                <div key={app.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">{app.vacancy.title}</p>
                      <p className="text-xs text-gray-400">
                        {app.vacancy.employer?.companyName ?? "Pusat Latihan"} · {formatDate(app.submittedAt)}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  {app.status === "REQUIRES_REVISION" && app.revisionNote && (
                    <p className="mt-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs text-orange-700">
                      ↩ {app.revisionNote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
