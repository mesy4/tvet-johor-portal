import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRedirectForRole } from "@/lib/rbac";
import type { UserRole } from "@prisma/client";

export default async function DashboardIndexPage() {
  const session = await auth();
  const role = session?.user?.role as UserRole | undefined;

  if (role) {
    redirect(getRedirectForRole(role));
  }

  // No session — middleware should have caught this, but redirect to login as fallback
  redirect("/auth/login");
}