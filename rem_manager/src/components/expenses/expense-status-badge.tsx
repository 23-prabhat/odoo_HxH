import { cn } from "@/lib/utils";
import type { ExpenseStatus } from "@/lib/types";

const statusClasses: Record<ExpenseStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

export function ExpenseStatusBadge({ status }: { status: ExpenseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}
