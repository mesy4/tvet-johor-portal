import { requireRole }     from "@/lib/session";
import { prisma }          from "@/lib/prisma";
import { StatCard }        from "@/components/dashboard/stat-card";
import { DocumentStatusBadge } from "@/components/upload/document-status-badge";
import { formatDate }      from "@/lib/utils";
import Link                from "next/link";
import {
  Users, FileText, Briefcase, Newspaper,
  Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Papan Pemuka Admin" };

export default async function AdminDashboardPage() {
  await requireRole(["SUPERADMIN", "ADMIN_ADTEC", "ADMIN_JTDC"]);

  const [
    totalUsers,
    totalVacancies,
    pendingDocs,
    publishedNews,
    recentUsers,
    recentDocs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.vacancy.count({ where: { status: "PUBLISHED" } }),
    prisma.document.count({ where: { status: { in: ["PENDING_REVIEW", "REQUIRES_REVISION"] } } }),
    prisma.news.count({ where: { status: "PUBLISHED" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    }),
    prisma.document.findMany({
      where: { status: { in: ["PENDING_REVIEW", "REQUIRES_REVISION"] } },
      orderBy: { createdAt: "asc" },
      take: 5,
      select: {
        id: true, fileName: true, documentType: true, status: true, createdAt: true,
        uploader: { select: { name: true } },
      },
    }),
  ]);

  const userBreakdown = await prisma.user.groupBy({
    by: ["role"],
    _count: { id: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Papan Pemuka Admin</h1>
        <p className="mt-1 text-sm text-gray-500">Ringkasan sistem portal TVET Johor</p>
      </div>

      {/* ── Stats grid ──────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Jumlah Pengguna"       value={totalUsers}    icon={Users}      accent="navy"  subtitle="Semua peranan" />
        <StatCard title="Iklan Kerja Aktif"     value={totalVacancies} icon={Briefcase} accent="green" />
        <StatCard title="Dokumen Menunggu"      value={pendingDocs}   icon={FileText}   accent="amber" subtitle="Perlu semakan" />
        <StatCard title="Berita Disiarkan"      value={publishedNews} icon={Newspaper}  accent="red" />
      </div>

      {/* ── User breakdown ───────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-base font-semibold text-gray-800">Pecahan Pengguna</h2>
          <div className="space-y-3">
            {userBreakdown.map((row) => (
              <div key={row.role} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{row.role}</span>
                <span className="font-semibold text-gray-900">{row._count.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent registrations ─────────────────────────── */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-gray-800">Pendaftaran Terbaru</h2>
            <Link href="/dashboard/admin/users" className="text-xs text-johor-navy-600 hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-johor-navy-100 text-xs font-semibold text-johor-navy-700">
                    {user.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-gray-400 sm:block">{formatDate(user.createdAt)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {user.status === "ACTIVE" ? "Aktif" : "Belum Disahkan"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Document review queue ────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-gray-800">
            Dokumen Menunggu Semakan
            {pendingDocs > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {pendingDocs}
              </span>
            )}
          </h2>
          <Link href="/dashboard/admin/documents" className="text-xs text-johor-navy-600 hover:underline">
            Semak semua →
          </Link>
        </div>
        {recentDocs.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Tiada dokumen menunggu semakan.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{doc.fileName}</p>
                    <p className="text-xs text-gray-400">
                      {doc.uploader.name} · {doc.documentType} · {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DocumentStatusBadge status={doc.status} />
                  <Link
                    href="/dashboard/admin/documents"
                    className="rounded-lg border border-johor-navy-200 px-3 py-1 text-xs font-medium text-johor-navy-600 hover:bg-johor-navy-50"
                  >
                    Semak
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
