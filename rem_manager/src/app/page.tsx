import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("sem_auth")?.value === "1";

  redirect(isAuthenticated ? "/dashboard" : "/auth/login");
}
