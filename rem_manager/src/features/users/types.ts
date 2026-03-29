export type CreateUserInput = {
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  managerId?: string;
};
