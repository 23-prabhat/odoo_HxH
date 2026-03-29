import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden border-r border-border/80 bg-[#fbfbf8] px-12 py-14 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="font-heading text-2xl font-semibold">Smart Expense</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Approval workflows, role-based views, and expense operations in one focused workspace.
          </p>
        </div>
        <div className="max-w-md space-y-6">
          <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-sm shadow-slate-900/4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Workspace flow</p>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-medium">Submit</p>
                <p className="mt-1 text-sm text-muted-foreground">Employees create claims with receipts and notes.</p>
              </div>
              <div>
                <p className="text-sm font-medium">Review</p>
                <p className="mt-1 text-sm text-muted-foreground">Managers and admins approve in a clean queue.</p>
              </div>
              <div>
                <p className="text-sm font-medium">Track</p>
                <p className="mt-1 text-sm text-muted-foreground">History stays visible by role and status.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-4">
          <LoginForm mode="login" />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-foreground">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
