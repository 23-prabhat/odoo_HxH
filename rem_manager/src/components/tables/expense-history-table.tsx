"use client";

import { useMemo, useState } from "react";

import type { Expense } from "@/lib/types";
import { ExpenseStatusBadge } from "@/components/expenses/expense-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ExpenseHistoryTable({ expenses }: { expenses: Expense[] }) {
  const [status, setStatus] = useState("ALL");

  const filteredExpenses = useMemo(() => {
    if (status === "ALL") {
      return expenses;
    }

    return expenses.filter((expense) => expense.status === status);
  }, [expenses, status]);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium">Status filter</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Narrow the table to the expense state you want to review.
            </p>
          </div>
          <div className="max-w-xs">
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.employeeName}</TableCell>
                  <TableCell>{formatCurrency(expense.amount, expense.currency)}</TableCell>
                  <TableCell>
                    <ExpenseStatusBadge status={expense.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
