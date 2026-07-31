import { handlers } from "@/lib/auth";

// Expose GET and POST for the Auth.js catch-all route
// GET  /api/auth/[...nextauth] — sign-in page redirects, CSRF token
// POST /api/auth/[...nextauth] — credential submission, session callbacks
export const { GET, POST } = handlers;
