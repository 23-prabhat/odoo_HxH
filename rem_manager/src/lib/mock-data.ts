import type { AppState, Company, Expense, Role, Session, User } from "@/lib/types";

export const currencies = ["USD", "EUR", "INR", "GBP", "SGD"];

export const categories = [
  "Travel",
  "Meals",
  "Lodging",
  "Office Supplies",
  "Software",
  "Other",
];

export const companyByCountry: Record<string, Company> = {
  "United States": { name: "Northstar Labs", currency: "USD", country: "United States" },
  India: { name: "Northstar Labs", currency: "INR", country: "India" },
  Germany: { name: "Northstar Labs", currency: "EUR", country: "Germany" },
};

export const defaultCompany = companyByCountry["United States"];

export const mockUsers: User[] = [
  { id: "u-1", name: "Aisha Morgan", email: "aisha@northstar.io", role: "ADMIN" },
  { id: "u-2", name: "Maya Chen", email: "maya@northstar.io", role: "MANAGER" },
  { id: "u-3", name: "Emma Lewis", email: "emma@northstar.io", role: "EMPLOYEE", managerId: "u-2" },
  { id: "u-4", name: "Rohan Kapoor", email: "rohan@northstar.io", role: "EMPLOYEE", managerId: "u-2" },
];

export const mockExpenses: Expense[] = [
  {
    id: "EXP-1001",
    employeeId: "u-3",
    employeeName: "Emma Lewis",
    amount: 180,
    currency: "USD",
    category: "Travel",
    description: "Taxi and airport transfer",
    date: "2026-03-26",
    receiptName: "taxi-receipt.pdf",
    status: "PENDING",
  },
  {
    id: "EXP-1002",
    employeeId: "u-4",
    employeeName: "Rohan Kapoor",
    amount: 92,
    currency: "EUR",
    category: "Meals",
    description: "Client lunch meeting",
    date: "2026-03-24",
    receiptName: "lunch.jpg",
    status: "APPROVED",
    comment: "Approved by finance",
  },
  {
    id: "EXP-1003",
    employeeId: "u-3",
    employeeName: "Emma Lewis",
    amount: 45,
    currency: "USD",
    category: "Office Supplies",
    description: "Notebooks and pens",
    date: "2026-03-21",
    receiptName: "supplies.pdf",
    status: "REJECTED",
    comment: "Please attach itemized receipt",
  },
];

export const defaultSession: Session = {
  isAuthenticated: false,
  userId: "",
  name: "",
  email: "",
  role: "EMPLOYEE",
  company: defaultCompany,
};

export const appSeed: AppState = {
  session: defaultSession,
  users: mockUsers,
  expenses: mockExpenses,
  workflowSteps: ["Manager", "Finance"],
  managerApprover: true,
};

export function getRoleLabel(role: Role) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}
