import type { Role } from "@/lib/types";

export const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] as Role[] },
  { href: "/expenses/new", label: "New Expense", roles: ["ADMIN", "EMPLOYEE"] as Role[] },
  { href: "/expenses/history", label: "Expense History", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] as Role[] },
  { href: "/approvals", label: "Approvals", roles: ["ADMIN", "MANAGER"] as Role[] },
  { href: "/admin/users", label: "Admin Users", roles: ["ADMIN"] as Role[] },
  { href: "/admin/workflow", label: "Workflow", roles: ["ADMIN"] as Role[] },
  { href: "/settings", label: "Settings", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] as Role[] },
];
