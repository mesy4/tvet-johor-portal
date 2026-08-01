import { UserRole } from "@prisma/client";

// ─────────────────────────────────────────────────────────────
// Route → Allowed roles mapping
// Matches the /dashboard/* route groups defined in the App Router
// ─────────────────────────────────────────────────────────────
export const ROLE_ROUTES: Record<string, UserRole[]> = {
  "/dashboard/admin":    [UserRole.SUPERADMIN, UserRole.ADMIN_ADTEC, UserRole.ADMIN_JTDC],
  "/dashboard/employer": [UserRole.EMPLOYER],
  "/dashboard/student":  [UserRole.STUDENT],
  "/dashboard/provider": [UserRole.PROVIDER],
  "/dashboard/official": [UserRole.OFFICIAL],
};

// Default landing page per role after sign-in
export const ROLE_HOME: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]:  "/dashboard/admin",
  [UserRole.ADMIN_ADTEC]: "/dashboard/admin",
  [UserRole.ADMIN_JTDC]:  "/dashboard/admin",
  [UserRole.EMPLOYER]:    "/dashboard/employer",
  [UserRole.STUDENT]:     "/dashboard/student",
  [UserRole.PROVIDER]:    "/dashboard/provider",
  [UserRole.OFFICIAL]:    "/dashboard/official",
};

// Roles that are considered "admin-level"
export const ADMIN_ROLES: UserRole[] = [
  UserRole.SUPERADMIN,
  UserRole.ADMIN_ADTEC,
  UserRole.ADMIN_JTDC,
];

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      return allowedRoles.includes(role);
    }
  }
  // Route not in the protected map — allow (public routes)
  return true;
}

export function getRedirectForRole(role: UserRole): string {
  return ROLE_HOME[role] ?? "/";
}
