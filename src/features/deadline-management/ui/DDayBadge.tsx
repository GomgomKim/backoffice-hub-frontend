"use client";

import { cn } from "@/shared/lib/utils";
import { getDaysUntil, formatDDay, getDeadlineStatus } from "@/shared/lib/utils";

interface DDayBadgeProps {
  dueDate: string | Date;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const statusStyles = {
  overdue: "bg-red-100 text-red-700 border-red-200",
  urgent: "bg-orange-100 text-orange-700 border-orange-200",
  upcoming: "bg-yellow-100 text-yellow-700 border-yellow-200",
  safe: "bg-green-100 text-green-700 border-green-200",
};

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function DDayBadge({ dueDate, className, size = "md" }: DDayBadgeProps) {
  const days = getDaysUntil(dueDate);
  const status = getDeadlineStatus(days);
  const label = formatDDay(days);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-semibold",
        statusStyles[status],
        sizeStyles[size],
        className
      )}
    >
      {label}
    </span>
  );
}
