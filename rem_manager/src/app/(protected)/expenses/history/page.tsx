"use client";

import { useAppContext } from "@/context/app-context";
import { ExpenseHistoryTable } from "@/components/expenses/expense-history-table";
import { PageHeader } from "@/components/layout/page-header";

export default function ExpenseHistoryPage() {
  const { expenses } = useAppContext();

  return (
    <div className="space-y-6">
      <PageHeader title="Expense History" description="Filter and review previously submitted expense claims." />
      <ExpenseHistoryTable expenses={expenses} />
    </div>
  );
}
