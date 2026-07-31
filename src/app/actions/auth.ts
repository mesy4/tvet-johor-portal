"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { loginSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { getRedirectForRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  studentRegisterSchema,
  employerRegisterSchema,
  providerRegisterSchema,
} from "@/lib/validations/auth";
import type { UserRole } from "@prisma/client";

// ── Return type for form actions ──────────────────────────────
export type ActionResult = {
  success: boolean;
  error?: string;
};

// ─────────────────────────────────────────────────────────────
// SIGN IN
// ─────────────────────────────────────────────────────────────
export async function loginAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email:    formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Format emel atau kata laluan tidak sah." };
  }

  try {
    await signIn("credentials", {
      email:    parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { success: false, error: "Emel atau kata laluan tidak betul." };
        default:
          return { success: false, error: "Ralat semasa log masuk. Cuba lagi." };
      }
    }
    // Auth.js uses NEXT_REDIRECT internally — let it propagate
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// SIGN OUT
// ─────────────────────────────────────────────────────────────
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

// ─────────────────────────────────────────────────────────────
// REGISTER — STUDENT
// ─────────────────────────────────────────────────────────────
export async function registerStudentAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name:            formData.get("name"),
    email:           formData.get("email"),
    password:        formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = studentRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message;
    return { success: false, error: firstError ?? "Data tidak sah." };
  }

  return createUser(parsed.data.name, parsed.data.email, parsed.data.password, "STUDENT");
}

// ─────────────────────────────────────────────────────────────
// REGISTER — EMPLOYER
// ─────────────────────────────────────────────────────────────
export async function registerEmployerAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name:            formData.get("name"),
    email:           formData.get("email"),
    password:        formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    companyName:     formData.get("companyName"),
  };

  const parsed = employerRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message;
    return { success: false, error: firstError ?? "Data tidak sah." };
  }

  return createUser(
    parsed.data.name,
    parsed.data.email,
    parsed.data.password,
    "EMPLOYER",
    { companyName: parsed.data.companyName }
  );
}

// ─────────────────────────────────────────────────────────────
// REGISTER — PROVIDER
// ─────────────────────────────────────────────────────────────
export async function registerProviderAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name:            formData.get("name"),
    email:           formData.get("email"),
    password:        formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    institutionName: formData.get("institutionName"),
  };

  const parsed = providerRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message;
    return { success: false, error: firstError ?? "Data tidak sah." };
  }

  return createUser(
    parsed.data.name,
    parsed.data.email,
    parsed.data.password,
    "PROVIDER",
    { institutionName: parsed.data.institutionName }
  );
}

// ─────────────────────────────────────────────────────────────
// Internal helper — create user + role profile atomically
// ─────────────────────────────────────────────────────────────
async function createUser(
  name: string,
  email: string,
  password: string,
  role: UserRole,
  extra?: { companyName?: string; institutionName?: string }
): Promise<ActionResult> {
  // Check for duplicate email
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return { success: false, error: "Emel ini telah didaftarkan." };
  }

  // Hash password with bcrypt (cost factor 12)
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          status: "PENDING_VERIFICATION",
        },
      });

      // Create the matching role profile
      if (role === "STUDENT") {
        await tx.studentProfile.create({ data: { userId: user.id } });
      } else if (role === "EMPLOYER" && extra?.companyName) {
        await tx.employerProfile.create({
          data: { userId: user.id, companyName: extra.companyName },
        });
      } else if (role === "PROVIDER" && extra?.institutionName) {
        await tx.providerProfile.create({
          data: { userId: user.id, institutionName: extra.institutionName },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId:     user.id,
          action:      "CREATE",
          entityType:  "User",
          entityId:    user.id,
          description: `New ${role} account registered`,
        },
      });
    });

    return { success: true };
  } catch {
    return { success: false, error: "Pendaftaran gagal. Sila cuba lagi." };
  }
}
