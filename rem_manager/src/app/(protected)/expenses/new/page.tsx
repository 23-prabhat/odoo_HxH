import { ExpenseForm } from "@/components/expenses/expense-form";
import { PageHeader } from "@/components/layout/page-header";

export default function NewExpensePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Expense" description="Capture a reimbursement request with amount, category, date, and receipt." />
      <ExpenseForm />
    </div>
  );
}
