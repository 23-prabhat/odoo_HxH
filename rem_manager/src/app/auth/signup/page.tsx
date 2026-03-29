import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden border-r border-border/80 bg-[#fbfbf8] px-12 py-14 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="font-heading text-2xl font-semibold">Create your workspace</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Set company country and bootstrap the first admin account with the right default currency.
          </p>
        </div>
        <div className="max-w-md rounded-3xl border border-border/80 bg-white p-6 shadow-sm shadow-slate-900/4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">What happens next</p>
          <div className="mt-5 space-y-4">
            <p className="text-sm text-muted-foreground">1. Company is created.</p>
            <p className="text-sm text-muted-foreground">2. Admin account is created.</p>
            <p className="text-sm text-muted-foreground">3. You land in the dashboard ready to invite your team.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-4">
          <SignupForm mode="signup" />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-foreground">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
