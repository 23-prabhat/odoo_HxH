import type { Role, Session } from "@/lib/types";

export const AUTH_COOKIE = "sem_auth";
export const ROLE_COOKIE = "sem_role";
export const NAME_COOKIE = "sem_name";
export const EMAIL_COOKIE = "sem_email";
export const USER_COOKIE = "sem_user";
export const COMPANY_COOKIE = "sem_company";
export const CURRENCY_COOKIE = "sem_currency";
export const COUNTRY_COOKIE = "sem_country";

export const publicRoutes = ["/auth/login", "/auth/signup"];

export function writeSessionCookies(session: Session) {
  if (typeof document === "undefined") {
    return;
  }

  const values: Array<[string, string]> = [
    [AUTH_COOKIE, session.isAuthenticated ? "1" : "0"],
    [ROLE_COOKIE, session.role],
    [NAME_COOKIE, session.name],
    [EMAIL_COOKIE, session.email],
    [USER_COOKIE, session.userId],
    [COMPANY_COOKIE, session.company.name],
    [CURRENCY_COOKIE, session.company.currency],
    [COUNTRY_COOKIE, session.company.country],
  ];

  values.forEach(([key, value]) => {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=2592000; SameSite=Lax`;
  });
}

export function clearSessionCookies() {
  if (typeof document === "undefined") {
    return;
  }

  [AUTH_COOKIE, ROLE_COOKIE, NAME_COOKIE, EMAIL_COOKIE, USER_COOKIE, COMPANY_COOKIE, CURRENCY_COOKIE, COUNTRY_COOKIE].forEach(
    (key) => {
      document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
    },
  );
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  return (
    document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
}

export function readSessionCookies(): Session | null {
  const isAuthenticated = getCookieValue(AUTH_COOKIE) === "1";
  const role = decodeURIComponent(getCookieValue(ROLE_COOKIE)) as Role;
  const name = decodeURIComponent(getCookieValue(NAME_COOKIE));
  const email = decodeURIComponent(getCookieValue(EMAIL_COOKIE));
  const userId = decodeURIComponent(getCookieValue(USER_COOKIE));
  const companyName = decodeURIComponent(getCookieValue(COMPANY_COOKIE));
  const currency = decodeURIComponent(getCookieValue(CURRENCY_COOKIE));
  const country = decodeURIComponent(getCookieValue(COUNTRY_COOKIE));

  if (!isAuthenticated || !role || !name || !email || !userId || !companyName || !currency || !country) {
    return null;
  }

  return {
    isAuthenticated: true,
    role,
    name,
    email,
    userId,
    company: {
      name: companyName,
      currency,
      country,
    },
  };
}

export function getAllowedRoutes(role: Role) {
  if (role === "ADMIN") {
    return [
      "/dashboard",
      "/expenses/new",
      "/expenses/history",
      "/approvals",
      "/admin/users",
      "/admin/workflow",
      "/settings",
    ];
  }

  if (role === "MANAGER") {
    return ["/dashboard", "/expenses/history", "/approvals", "/settings"];
  }

  return ["/dashboard", "/expenses/new", "/expenses/history", "/settings"];
}

export function canAccessPath(pathname: string, role: Role) {
  return getAllowedRoutes(role).some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
