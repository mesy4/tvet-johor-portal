import { requireRole }  from "@/lib/session";
import { prisma }       from "@/lib/prisma";
import { formatDate }   from "@/lib/utils";
import type { Metadata }  from "next";
import type { UserRole, AccountStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Pengurusan Pengguna" };

const ROLE_LABELS: Record<UserRole, string> = {
  SUPERADMIN:  "Super Admin",
  ADMIN_ADTEC: "Admin ADTEC",
  ADMIN_JTDC:  "Admin JTDC",
  STUDENT:     "Pelajar",
  EMPLOYER:    "Majikan",
  PROVIDER:    "Pusat Latihan",
  OFFICIAL:    "Pegawai",
};
const STATUS_STYLES: Record<AccountStatus, string> = {
  ACTIVE:                "bg-green-100 text-green-700",
  SUSPENDED:             "bg-red-100 text-red-700",
  PENDING_VERIFICATION:  "bg-amber-100 text-amber-700",
};
const STATUS_LABELS: Record<AccountStatus, string> = {
  ACTIVE:               "Aktif",
  SUSPENDED:            "Digantung",
  PENDING_VERIFICATION: "Belum Disahkan",
};

export default async function AdminUsersPage() {
  await requireRole(["SUPERADMIN", "ADMIN_ADTEC", "ADMIN_JTDC"]);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id:           true,
      name:         true,
      email:        true,
      role:         true,
      status:       true,
      createdAt:    true,
      lastLoginAt:  true,
      emailVerified: true,
    },
  });

  const counts = {
    total:     users.length,
    active:    users.filter((u) => u.status === "ACTIVE").length,
    pending:   users.filter((u) => u.status === "PENDING_VERIFICATION").length,
    suspended: users.filter((u) => u.status === "SUSPENDED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Pengurusan Pengguna</h1>
        <p className="mt-1 text-sm text-gray-500">{counts.total} akaun terdaftar</p>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Jumlah", value: counts.total,     color: "bg-gray-100 text-gray-700" },
          { label: "Aktif",  value: counts.active,    color: "bg-green-100 text-green-700" },
          { label: "Belum Disahkan", value: counts.pending,  color: "bg-amber-100 text-amber-700" },
          { label: "Digantung",      value: counts.suspended, color: "bg-red-100 text-red-700" },
        ].map((item) => (
          <span key={item.label} className={`rounded-full px-3 py-1 text-sm font-medium ${item.color}`}>
            {item.label}: <strong>{item.value}</strong>
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3">Pengguna</th>
                <th className="px-5 py-3 hidden md:table-cell">Peranan</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 hidden lg:table-cell">Log Masuk Terakhir</th>
                <th className="px-5 py-3 hidden lg:table-cell">Tarikh Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-johor-navy-100 text-xs font-semibold text-johor-navy-700">
                        {user.name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-800">{user.name ?? "—"}</p>
                        <p className="truncate text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="rounded-full bg-johor-navy-50 px-2 py-0.5 text-xs font-medium text-johor-navy-700">
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[user.status]}`}>
                      {STATUS_LABELS[user.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Belum pernah"}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
