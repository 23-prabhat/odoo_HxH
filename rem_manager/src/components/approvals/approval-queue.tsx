"use client";

import { useMemo, useState } from "react";

import type { Expense } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExpenseStatusBadge } from "@/components/expenses/expense-status-badge";
import { formatCurrency } from "@/lib/format";

type ApprovalQueueProps = {
  expenses: Expense[];
  onApprove: (expenseId: string, comment?: string) => void;
  onReject: (expenseId: string, comment?: string) => void;
};

export function ApprovalQueue({
  expenses,
  onApprove,
  onReject,
}: ApprovalQueueProps) {
  const [comments, setComments] = useState<Record<string, string>>({});

  const pendingExpenses = useMemo(
    () => expenses.filter((expense) => expense.status === "PENDING"),
    [expenses],
  );

  return (
    <div className="space-y-4">
      {pendingExpenses.map((expense) => (
        <Card key={expense.id}>
          <CardHeader className="flex flex-col gap-3 border-b border-border/70 pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle>{expense.employeeName}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {expense.category} · {expense.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-heading text-xl font-semibold">{formatCurrency(expense.amount, expense.currency)}</p>
              <ExpenseStatusBadge status={expense.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <p className="text-sm leading-6 text-slate-700">{expense.description}</p>
            <Input
              placeholder="Optional comment"
              value={comments[expense.id] ?? ""}
              onChange={(event) =>
                setComments((current) => ({ ...current, [expense.id]: event.target.value }))
              }
            />
            <div className="flex gap-3">
              <Button onClick={() => onApprove(expense.id, comments[expense.id] ?? "")}>
                Approve
              </Button>
              <Button variant="outline" onClick={() => onReject(expense.id, comments[expense.id] ?? "")}>
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
