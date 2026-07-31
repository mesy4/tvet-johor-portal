import type { UserRole } from "@prisma/client";
import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

// Augment next-auth types so session.user.role and session.user.id
// are available everywhere without casting
declare module "next-auth" {
  interface Session {
    user: {
      id:   string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id:   string;
    role: UserRole;
  }
}
