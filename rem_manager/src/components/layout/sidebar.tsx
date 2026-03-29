"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarItems } from "@/lib/routes";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: Role;
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = sidebarItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border/80 bg-[#fbfbf8] md:block">
      <div className="flex h-20 items-center border-b border-border/80 px-6">
        <div>
          <p className="font-heading text-lg font-semibold">Smart Expense</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Expense Management System
          </p>
        </div>
      </div>
      <div className="border-b border-border/80 px-6 py-5">
        <div className="rounded-2xl border border-border/80 bg-white px-4 py-4 shadow-sm shadow-slate-900/3">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Role</p>
          <p className="mt-2 text-sm font-medium text-foreground">{role}</p>
        </div>
      </div>
      <nav className="space-y-1.5 p-4">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground",
                active && "bg-white font-medium text-foreground shadow-sm shadow-slate-900/4",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
