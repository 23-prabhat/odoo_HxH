import type { Expense } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseStatusBadge } from "@/components/expenses/expense-status-badge";
import { formatCurrency } from "@/lib/format";

export function RecentExpenses({ expenses }: { expenses: Expense[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent expenses</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest submissions across the workspace.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {expenses.slice(0, 5).map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 px-4 py-4"
          >
            <div>
              <p className="text-sm font-medium">{expense.employeeName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {expense.category} · {expense.date}
              </p>
            </div>
              <div className="text-right">
              <p className="text-sm font-medium">{formatCurrency(expense.amount, expense.currency)}</p>
              <div className="mt-2">
                <ExpenseStatusBadge status={expense.status} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
