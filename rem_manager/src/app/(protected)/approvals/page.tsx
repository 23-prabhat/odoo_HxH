"use client";

import { useAppContext } from "@/context/app-context";
import { ApprovalQueue } from "@/components/approvals/approval-queue";
import { PageHeader } from "@/components/layout/page-header";

export default function ApprovalsPage() {
  const { expenses, updateExpenseStatus } = useAppContext();

  return (
    <div className="space-y-6">
      <PageHeader title="Approvals" description="Review pending expenses and leave a decision comment when needed." />
      <ApprovalQueue
        expenses={expenses}
        onApprove={(expenseId, comment) => updateExpenseStatus(expenseId, "APPROVED", comment)}
        onReject={(expenseId, comment) => updateExpenseStatus(expenseId, "REJECTED", comment)}
      />
    </div>
  );
}
