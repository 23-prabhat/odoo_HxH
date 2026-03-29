"use client";

import { useMemo } from "react";

import { useAppContext } from "@/context/app-context";
import type { Role, User } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UsersTable({ users }: { users: User[] }) {
  const { updateUserManager, updateUserRole } = useAppContext();
  const managers = useMemo(
    () => users.filter((user) => user.role === "ADMIN" || user.role === "MANAGER"),
    [users],
  );

  return (
    <Card>
      <CardContent className="overflow-x-auto pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Manager</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(event) => updateUserRole(user.id, event.target.value as Role)}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.managerId ?? ""}
                    onChange={(event) => updateUserManager(user.id, event.target.value)}
                  >
                    <option value="">No manager</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
