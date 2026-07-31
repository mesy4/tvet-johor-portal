import Link from "next/link";
import { Bell, Home } from "lucide-react";
import type { UserRole } from "@prisma/client";

interface DashboardHeaderProps {
  title:     string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  userName:  string;
  userRole:  UserRole;
}

export function DashboardHeader({ title, breadcrumb, userName, userRole }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* Left: title + breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/" className="text-gray-400 hover:text-gray-600" aria-label="Laman utama">
          <Home className="h-4 w-4" />
        </Link>
        {breadcrumb?.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-gray-300">/</span>
            {crumb.href ? (
              <Link href={crumb.href} className="text-gray-500 hover:text-johor-navy-600">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-800">{crumb.label}</span>
            )}
          </span>
        ))}
        {!breadcrumb && <span className="font-medium text-gray-800">{title}</span>}
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        <button
          className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Pemberitahuan"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-johor-navy-100 font-semibold text-xs text-johor-navy-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{userName}</span>
        </div>
      </div>
    </header>
  );
}
