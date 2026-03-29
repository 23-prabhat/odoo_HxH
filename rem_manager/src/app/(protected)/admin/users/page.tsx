"use client";

import { useAppContext } from "@/context/app-context";
import { UserCreateModal } from "@/components/admin/user-create-modal";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { PageHeader } from "@/components/layout/page-header";

export default function AdminUsersPage() {
  const { users } = useAppContext();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage employees, managers, and admins."
        action={<UserCreateModal />}
      />
      <UserManagementTable users={users} />
    </div>
  );
}
