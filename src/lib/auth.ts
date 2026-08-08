import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import type { UserRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  // ── Session strategy ──────────────────────────────────────
  // JWT is required when using Credentials provider
  session: { strategy: "jwt" },

  // ── Pages ─────────────────────────────────────────────────
  pages: {
    signIn:  "/auth/login",
    signOut: "/auth/logout",
    error:   "/auth/error",
    newUser: "/auth/register",
  },

  // ── Providers ─────────────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate input shape with Zod — reject malformed payloads
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Fetch user — parameterised query via Prisma (no SQL injection risk)
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id:           true,
            email:        true,
            name:         true,
            image:        true,
            passwordHash: true,
            role:         true,
            status:       true,
            emailVerified: true,
          },
        });

        if (!user || !user.passwordHash) return null;

        // 3. Constant-time password comparison
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) return null;

        // 4. Block suspended / unverified accounts
        if (user.status === "SUSPENDED") return null;
        if (user.status === "PENDING_VERIFICATION") return null;

        // 5. Update last login timestamp (fire-and-forget)
        prisma.user
          .update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })
          .catch(() => {});

        return {
          id:    user.id,
          email: user.email,
          name:  user.name ?? "",
          image: user.image ?? "",
          role:  user.role,
        };
      },
    }),
  ],

  // ── Callbacks ─────────────────────────────────────────────
  callbacks: {
    // Embed role into JWT token on sign-in
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id!;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },

    // Expose role on the client-side session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },

  // ── Events ────────────────────────────────────────────────
  events: {
    async signIn({ user }) {
      // Write an audit log entry on every successful login
      if (user.id) {
        await prisma.auditLog
          .create({
            data: {
              actorId:    user.id,
              action:     "LOGIN",
              entityType: "User",
              entityId:   user.id,
              description: "User signed in",
            },
          })
          .catch(() => {});
      }
    },
    async signOut(params) {
      // @ts-ignore — NextAuth v5 types vary; token exists at runtime
      const token = (params as { token?: { id?: string } }).token;
      const userId = token?.id;
      if (userId) {
        await prisma.auditLog
          .create({
            data: {
              actorId:    userId,
              action:     "LOGOUT",
              entityType: "User",
              entityId:   userId,
              description: "User signed out",
            },
          })
          .catch(() => {});
      }
    },
  },

  // ── Security ──────────────────────────────────────────────
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
