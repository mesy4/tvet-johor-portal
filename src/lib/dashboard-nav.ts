import { UserRole } from "@prisma/client";
import {
  LayoutDashboard,
  Users,
  FileText,
  Newspaper,
  Briefcase,
  ClipboardList,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  Building2,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label:  string;
  href:   string;
  icon:   LucideIcon;
  badge?: string;
};

export const DASHBOARD_NAV: Record<string, NavItem[]> = {
  // ── Admin (all three admin roles share the same nav) ─────
  ADMIN: [
    { label: "Papan Pemuka",        href: "/dashboard/admin",           icon: LayoutDashboard },
    { label: "Pengurusan Pengguna", href: "/dashboard/admin/users",     icon: Users },
    { label: "Semakan Dokumen",     href: "/dashboard/admin/documents", icon: FileText },
    { label: "Pengurusan Berita",   href: "/dashboard/admin/news",      icon: Newspaper },
  ],
  // ── Employer ─────────────────────────────────────────────
  EMPLOYER: [
    { label: "Papan Pemuka", href: "/dashboard/employer",           icon: LayoutDashboard },
    { label: "Dokumen",      href: "/dashboard/employer/documents", icon: FileText },
  ],
  // ── Student ──────────────────────────────────────────────
  STUDENT: [
    { label: "Papan Pemuka", href: "/dashboard/student",           icon: LayoutDashboard },
    { label: "Dokumen",      href: "/dashboard/student/documents", icon: FileText },
  ],
  // ── Provider ─────────────────────────────────────────────
  PROVIDER: [
    { label: "Papan Pemuka", href: "/dashboard/provider", icon: LayoutDashboard },
  ],
  // ── Government Official ───────────────────────────────────
  OFFICIAL: [
    { label: "Papan Pemuka", href: "/dashboard/official", icon: LayoutDashboard },
  ],
};

export function getNavForRole(role: UserRole): NavItem[] {
  if (role === UserRole.SUPERADMIN || role === UserRole.ADMIN_ADTEC || role === UserRole.ADMIN_JTDC) {
    return DASHBOARD_NAV.ADMIN;
  }
  return DASHBOARD_NAV[role] ?? [];
}

export const ROLE_DISPLAY: Record<UserRole, { label: string; color: string }> = {
  SUPERADMIN:  { label: "Super Admin",  color: "bg-purple-100 text-purple-700" },
  ADMIN_ADTEC: { label: "Admin ADTEC",  color: "bg-johor-navy-100 text-johor-navy-700" },
  ADMIN_JTDC:  { label: "Admin JTDC",   color: "bg-blue-100 text-blue-700" },
  STUDENT:     { label: "Pelajar",      color: "bg-green-100 text-green-700" },
  EMPLOYER:    { label: "Majikan",      color: "bg-orange-100 text-orange-700" },
  PROVIDER:    { label: "Pusat Latihan",color: "bg-teal-100 text-teal-700" },
  OFFICIAL:    { label: "Pegawai",      color: "bg-amber-100 text-amber-700" },
};
