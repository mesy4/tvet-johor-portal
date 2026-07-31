import { requireRole } from "@/lib/session";
import { prisma }      from "@/lib/prisma";
import { StatCard }    from "@/components/dashboard/stat-card";
import {
  Users, Briefcase, BookOpen, Building2,
  FileText, TrendingUp, BarChart3,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Papan Pemuka Pegawai" };

export default async function OfficialDashboardPage() {
  await requireRole("OFFICIAL");

  // Aggregate stats — read-only, no mutations possible on this page
  const [
    totalUsers,
    totalStudents,
    totalEmployers,
    totalProviders,
    totalVacancies,
    totalPrograms,
    totalApplications,
    totalEnrollments,
    usersByMonth,
    vacancyBySector,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "EMPLOYER" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),
    prisma.vacancy.count({ where: { status: "PUBLISHED" } }),
    prisma.trainingProgram.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.application.count(),
    prisma.enrollment.count(),
    // Last 6 months registrations
    prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') AS month, COUNT(*) AS count
      FROM users
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month ORDER BY month ASC
    `,
    prisma.vacancy.groupBy({
      by:     ["sector"],
      where:  { status: "PUBLISHED" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    }),
  ]);

  const SECTOR_LABELS: Record<string, string> = {
    MANUFACTURING:  "Pembuatan",
    CONSTRUCTION:   "Pembinaan",
    SERVICES:       "Perkhidmatan",
    TECHNOLOGY:     "Teknologi",
    AGRICULTURE:    "Pertanian",
    HOSPITALITY:    "Hospitaliti",
    HEALTHCARE:     "Kesihatan",
    LOGISTICS:      "Logistik",
    ENERGY:         "Tenaga",
    EDUCATION:      "Pendidikan",
    GOVERNMENT:     "Kerajaan",
    OTHER:          "Lain-lain",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Dashboard Analitik TVET Johor
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Paparan baca sahaja — data ekosistem TVET negeri Johor
        </p>
      </div>

      {/* Read-only badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        Mod Baca Sahaja — Akses Pegawai Kerajaan
      </div>

      {/* ── Primary stats ─────────────────────────────────── */}
      <div>
        <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-gray-400">
          Ringkasan Ekosistem
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Jumlah Pengguna"   value={totalUsers}        icon={Users}     accent="navy" />
          <StatCard title="Iklan Kerja Aktif" value={totalVacancies}    icon={Briefcase} accent="green" />
          <StatCard title="Program Latihan"   value={totalPrograms}     icon={BookOpen}  accent="amber" />
          <StatCard title="Jumlah Permohonan" value={totalApplications} icon={FileText}  accent="red" />
        </div>
      </div>

      {/* ── User breakdown ─────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Pelajar & Belia"    value={totalStudents}   icon={Users}    accent="navy" />
        <StatCard title="Majikan"            value={totalEmployers}  icon={Building2} accent="green" />
        <StatCard title="Pusat Latihan"      value={totalProviders}  icon={BookOpen}  accent="amber" />
      </div>

      {/* ── Vacancy by sector ──────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-johor-navy-600" />
            <h2 className="font-heading text-base font-semibold text-gray-800">Iklan Kerja Mengikut Sektor</h2>
          </div>
          {vacancyBySector.length === 0 ? (
            <p className="text-sm text-gray-400">Tiada data.</p>
          ) : (
            <div className="space-y-3">
              {vacancyBySector.map((row) => {
                const total  = vacancyBySector.reduce((s, r) => s + r._count.id, 0);
                const pct    = total > 0 ? Math.round((row._count.id / total) * 100) : 0;
                return (
                  <div key={row.sector}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-gray-700">{SECTOR_LABELS[row.sector] ?? row.sector}</span>
                      <span className="font-semibold text-gray-900">{row._count.id} ({pct}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-johor-navy-500 transition-all"
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Monthly registrations */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-johor-navy-600" />
            <h2 className="font-heading text-base font-semibold text-gray-800">Pendaftaran 6 Bulan Terkini</h2>
          </div>
          {usersByMonth.length === 0 ? (
            <p className="text-sm text-gray-400">Tiada data.</p>
          ) : (
            <div className="space-y-3">
              {usersByMonth.map((row) => {
                const max = Math.max(...usersByMonth.map((r) => Number(r.count)));
                const pct = max > 0 ? Math.round((Number(row.count) / max) * 100) : 0;
                return (
                  <div key={row.month}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-gray-700">{row.month}</span>
                      <span className="font-semibold text-gray-900">{Number(row.count)} pengguna</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-johor-red-500 transition-all"
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Additional KPIs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Jumlah Pendaftaran Latihan</p>
          <p className="mt-2 font-heading text-3xl font-bold text-gray-900">{totalEnrollments}</p>
          <p className="mt-1 text-sm text-gray-500">merentas semua program aktif</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Nisbah Permohonan / Iklan</p>
          <p className="mt-2 font-heading text-3xl font-bold text-gray-900">
            {totalVacancies > 0 ? (totalApplications / totalVacancies).toFixed(1) : "—"}
          </p>
          <p className="mt-1 text-sm text-gray-500">purata pemohon setiap iklan</p>
        </div>
      </div>
    </div>
  );
}
