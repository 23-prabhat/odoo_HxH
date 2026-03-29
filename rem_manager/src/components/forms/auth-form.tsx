"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, signup } = useAppContext();
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "aisha@northstar.io",
    password: "password",
  });

  const [signupForm, setSignupForm] = useState({
    companyName: "Northstar Labs",
    name: "",
    email: "",
    password: "",
    country: "United States",
  });

  function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = login(loginForm.email, loginForm.password);

    if (!session) {
      setError("User not found. Try aisha@northstar.io, maya@northstar.io, or emma@northstar.io.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function handleSignupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signup(signupForm);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-border/80 bg-white">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Login" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Access your expense workspace."
            : "Create a company and admin account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "login" ? (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </div>
            <div className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              Demo accounts: aisha@northstar.io, maya@northstar.io, emma@northstar.io
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSignupSubmit}>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input
                id="companyName"
                value={signupForm.companyName}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, companyName: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={signupForm.name}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signupEmail">Email</Label>
              <Input
                id="signupEmail"
                type="email"
                value={signupForm.email}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signupPassword">Password</Label>
              <Input
                id="signupPassword"
                type="password"
                value={signupForm.password}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                value={signupForm.country}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, country: event.target.value }))
                }
              >
                <option>United States</option>
                <option>India</option>
                <option>Germany</option>
              </Select>
            </div>
            <div className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              The selected country determines the initial company currency for approvals and reporting.
            </div>
            <Button className="w-full" type="submit">
              Sign up
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
