"use client";

import { useMemo, useState } from "react";

import { useAppContext } from "@/context/app-context";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";

export function UserModal() {
  const { users, addUser } = useAppContext();
  const [open, setOpen] = useState(false);
  const managers = useMemo(
    () => users.filter((user) => user.role === "MANAGER" || user.role === "ADMIN"),
    [users],
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE" as Role,
    managerId: "",
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add user</Button>
      <Modal
        open={open}
        title="Add user"
        description="Create a new employee or manager."
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                addUser(form);
                setOpen(false);
                setForm({ name: "", email: "", role: "EMPLOYEE", managerId: "" });
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Name</Label>
            <Input
              id="userName"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email</Label>
            <Input
              id="userEmail"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <Select
                id="userRole"
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({ ...current, role: event.target.value as Role }))
                }
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userManager">Manager</Label>
              <Select
                id="userManager"
                value={form.managerId}
                onChange={(event) => setForm((current) => ({ ...current, managerId: event.target.value }))}
              >
                <option value="">No manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            Managers can review team expenses. Admins can access every route and workflow setting.
          </div>
        </div>
      </Modal>
    </>
  );
}
