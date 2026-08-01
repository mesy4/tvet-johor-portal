"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";
import { getNavForRole, ROLE_DISPLAY } from "@/lib/dashboard-nav";
import type { UserRole } from "@prisma/client";

interface DashboardSidebarProps {
  userRole:  UserRole;
  userName:  string;
  userEmail: string;
}

export function DashboardSidebar({ userRole, userName, userEmail }: DashboardSidebarProps) {
  const pathname   = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems   = getNavForRole(userRole);
  const roleDisplay = ROLE_DISPLAY[userRole];

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-gray-100 bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
      aria-label="Navigasi papan pemuka"
    >
      {/* ── Logo / brand ─────────────────────────────────── */}
      <div className={cn("flex items-center gap-3 border-b border-gray-100 px-4 py-4", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-johor-navy-500 font-heading text-xs font-bold text-white">
          T
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold text-johor-navy-700">TVET Johor</p>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", roleDisplay.color)}>
              {roleDisplay.label}
            </span>
          </div>
        )}
      </div>

      {/* ── Nav items ─────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-johor-navy-50 text-johor-navy-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                collapsed && "justify-center px-2"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-johor-navy-600" : "text-gray-400")} aria-hidden="true" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto rounded-full bg-johor-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User section + logout ─────────────────────────── */}
      <div className="border-t border-gray-100 px-2 py-3 space-y-1">
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-gray-800">{userName}</p>
            <p className="truncate text-xs text-gray-400">{userEmail}</p>
          </div>
        )}
        <form action={logoutAction}>
          <button
            type="submit"
            title={collapsed ? "Log Keluar" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-johor-red-600",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!collapsed && "Log Keluar"}
          </button>
        </form>
      </div>

      {/* ── Collapse toggle ───────────────────────────────── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
        aria-label={collapsed ? "Kembangkan sidebar" : "Runtuhkan sidebar"}
      >
        {collapsed
          ? <ChevronRight className="h-3 w-3 text-gray-500" />
          : <ChevronLeft  className="h-3 w-3 text-gray-500" />
        }
      </button>
    </aside>
  );
}
