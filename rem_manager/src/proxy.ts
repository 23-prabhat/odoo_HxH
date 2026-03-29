import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { canAccessPath, publicRoutes } from "@/lib/auth";
import type { Role } from "@/lib/types";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  const isAuthenticated = request.cookies.get("sem_auth")?.value === "1";
  const role = request.cookies.get("sem_role")?.value as Role | undefined;

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthenticated && role && !canAccessPath(pathname, role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
