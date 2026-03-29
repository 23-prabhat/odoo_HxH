import { canAccessPath } from "@/lib/auth";
import type { Role } from "@/lib/types";

export function useRoleAccess(pathname: string, role: Role) {
  return canAccessPath(pathname, role);
}
