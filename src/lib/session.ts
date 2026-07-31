import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

/**
 * Get the current session or return null.
 * Safe to call in any Server Component.
 */
export async function getSession() {
  return auth();
}

/**
 * Get the current session and throw a redirect to /auth/login
 * if there is no authenticated user. Use in protected Server Components.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  return session;
}

/**
 * Require a specific role (or one of several roles).
 * Redirects to /dashboard/[role-home] if the user has the wrong role.
 */
export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const session = await requireSession();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(session.user.role)) {
    const { getRedirectForRole } = await import("@/lib/rbac");
    redirect(getRedirectForRole(session.user.role));
  }

  return session;
}
