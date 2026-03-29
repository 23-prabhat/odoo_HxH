"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { canAccessPath } from "@/lib/auth";
import { useAppContext } from "@/context/app-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, session, logout } = useAppContext();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!session.isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (!canAccessPath(pathname, session.role)) {
      router.replace("/dashboard");
    }
  }, [hydrated, pathname, router, session]);

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background md:flex">
      <Sidebar role={session.role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar session={session} onLogout={logout} />
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
