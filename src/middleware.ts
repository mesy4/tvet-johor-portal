import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { canAccessRoute, getRedirectForRole } from "@/lib/rbac";
import type { UserRole } from "@prisma/client";

// ─────────────────────────────────────────────────────────────
// Route matchers
// ─────────────────────────────────────────────────────────────

/** Routes that require authentication but no specific role */
const PROTECTED_PREFIX = "/dashboard";

/** Routes only accessible when NOT signed in */
const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
];

/** Fully public routes — middleware skips these entirely */
const PUBLIC_PREFIXES = [
  "/api/auth",   // Auth.js handler
  "/_next",      // Next.js internals
  "/favicon.ico",
  "/images",
  "/icons",
];

// ─────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────
export default auth(function middleware(req: NextRequest & { auth: { user?: { role?: UserRole } } | null }) {
  const { pathname } = req.nextUrl;
  const session = (req as unknown as { auth: { user?: { id: string; role: UserRole } } | null }).auth;

  // 1. Skip middleware for public asset / API routes
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  // 2. Redirect signed-in users away from auth pages
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const home = getRedirectForRole(userRole!);
    return NextResponse.redirect(new URL(home, req.url));
  }

  // 3. Protect all /dashboard/* routes
  if (pathname.startsWith(PROTECTED_PREFIX)) {
    // 3a. Not signed in → redirect to login with callbackUrl
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3b. Signed in but wrong role → redirect to own dashboard
    if (userRole && !canAccessRoute(userRole, pathname)) {
      const home = getRedirectForRole(userRole);
      return NextResponse.redirect(new URL(home, req.url));
    }
  }

  // 4. Attach role header for Server Components (avoids re-fetching session)
  const response = NextResponse.next();
  if (userRole) {
    response.headers.set("x-user-role", userRole);
  }
  return response;
});

// ─────────────────────────────────────────────────────────────
// Config — which paths the middleware runs on
// ─────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
