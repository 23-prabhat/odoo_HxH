export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export type ExpenseStatus = "PENDING" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string;
};

export type Expense = {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  receiptName?: string;
  status: ExpenseStatus;
  comment?: string;
};

export type Company = {
  name: string;
  currency: string;
  country: string;
};

export type Session = {
  isAuthenticated: boolean;
  userId: string;
  name: string;
  email: string;
  role: Role;
  company: Company;
};

export type AppState = {
  session: Session;
  users: User[];
  expenses: Expense[];
  workflowSteps: string[];
  managerApprover: boolean;
};
