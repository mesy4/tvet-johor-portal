import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title:     string;
  value:     string | number;
  subtitle?: string;
  icon:      LucideIcon;
  trend?:    { value: string; positive: boolean };
  accent?:   "navy" | "red" | "green" | "amber";
  className?: string;
}

const ACCENT_STYLES = {
  navy:  { bg: "bg-johor-navy-50",  icon: "text-johor-navy-600"  },
  red:   { bg: "bg-johor-red-50",   icon: "text-johor-red-600"   },
  green: { bg: "bg-green-50",       icon: "text-green-600"       },
  amber: { bg: "bg-amber-50",       icon: "text-amber-600"       },
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, accent = "navy", className }: StatCardProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{title}</p>
          <p className="mt-1.5 font-heading text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-1.5 text-xs font-medium", trend.positive ? "text-green-600" : "text-johor-red-500")}>
              {trend.positive ? "▲" : "▼"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", styles.bg)}>
          <Icon className={cn("h-5 w-5", styles.icon)} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
