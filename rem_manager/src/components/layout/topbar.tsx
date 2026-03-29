"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getRoleLabel } from "@/lib/mock-data";
import type { Session } from "@/lib/types";

type TopbarProps = {
  session: Session;
  onLogout: () => void;
};

export function Topbar({ session, onLogout }: TopbarProps) {
  const router = useRouter();

  return (
    <header className="flex h-20 items-center justify-between border-b border-border/80 bg-[#fbfbf8] px-4 md:px-6">
      <div>
        <p className="font-heading text-lg font-semibold">{session.company.name}</p>
        <p className="text-xs text-muted-foreground">
          {getRoleLabel(session.role)} · {session.company.currency}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-border/80 bg-white px-4 py-3 text-right shadow-sm shadow-slate-900/3">
          <p className="text-sm font-medium">{session.name}</p>
          <p className="text-xs text-muted-foreground">{session.email}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            onLogout();
            router.refresh();
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
