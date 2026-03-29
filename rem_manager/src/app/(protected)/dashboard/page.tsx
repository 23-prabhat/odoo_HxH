"use client";

import { useMemo } from "react";

import { useAppContext } from "@/context/app-context";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  const { expenses } = useAppContext();

  const stats = useMemo(() => {
    return {
      total: expenses.length,
      pending: expenses.filter((expense) => expense.status === "PENDING").length,
      approved: expenses.filter((expense) => expense.status === "APPROVED").length,
    };
  }, [expenses]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of submitted claims, active reviews, and the latest expense activity."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Total Expenses" value={stats.total} note="All submitted claims in the workspace." />
        <KpiCard label="Pending" value={stats.pending} note="Claims waiting for approval action." />
        <KpiCard label="Approved" value={stats.approved} note="Claims that cleared the workflow." />
      </div>
      <RecentExpenses expenses={expenses} />
    </div>
  );
}
