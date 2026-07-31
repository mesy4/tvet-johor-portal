import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@prisma/client";

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  PENDING_REVIEW:   { label: "Dalam Semakan",      className: "bg-amber-100 text-amber-800 border-amber-200" },
  REQUIRES_REVISION:{ label: "Pindaan Diperlukan", className: "bg-orange-100 text-orange-800 border-orange-200" },
  APPROVED:         { label: "Diluluskan",          className: "bg-green-100 text-green-800 border-green-200" },
  REJECTED:         { label: "Ditolak",             className: "bg-red-100 text-red-700 border-red-200" },
};

interface DocumentStatusBadgeProps {
  status:    DocumentStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
