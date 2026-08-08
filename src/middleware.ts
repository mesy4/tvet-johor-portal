import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────
// Route matchers
// ─────────────────────────────────────────────────────────────

/** Routes that require authentication */
const PROTECTED_PREFIX = "/dashboard";

/** Routes only accessible when NOT signed in */
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

/** Fully public routes — middleware skips these entirely */
const PUBLIC_PREFIXES = [
  "/api/auth",   // Auth.js handler
  "/_next",      // Next.js internals
  "/favicon.ico",
  "/images",
  "/icons",
  "/videos",
];

// ─────────────────────────────────────────────────────────────
// Middleware (Edge — lightweight, no Prisma/bcryptjs imports)
// ─────────────────────────────────────────────────────────────
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip middleware for public asset / API routes
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 2. Check for session — read the auth cookie set by NextAuth
  const hasSession = req.cookies.has("authjs.session-token") ||
                     req.cookies.has("next-auth.session-token") ||
                     req.cookies.has("__Secure-authjs.session-token") ||
                     req.cookies.has("__Secure-next-auth.session-token");

  // 3. Redirect signed-in users away from auth pages
  if (hasSession && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 4. Protect all /dashboard/* routes
  if (pathname.startsWith(PROTECTED_PREFIX)) {
    // Not signed in → redirect to login with callbackUrl
    if (!hasSession) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// ─────────────────────────────────────────────────────────────
// Config — which paths the middleware runs on
// ─────────────────────────────────────────────────────────────
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
