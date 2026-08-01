import { z } from "zod";

// ── Login ────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Emel diperlukan")
    .email("Format emel tidak sah")
    .max(254, "Emel terlalu panjang"),
  password: z
    .string()
    .min(1, "Kata laluan diperlukan")
    .max(128, "Kata laluan terlalu panjang"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ── Registration (shared base) ───────────────────────────────
const baseRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Nama mestilah sekurang-kurangnya 2 aksara")
    .max(100, "Nama terlalu panjang"),
  email: z
    .string()
    .min(1, "Emel diperlukan")
    .email("Format emel tidak sah")
    .max(254, "Emel terlalu panjang"),
  password: z
    .string()
    .min(8, "Kata laluan mestilah sekurang-kurangnya 8 aksara")
    .max(128, "Kata laluan terlalu panjang")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Kata laluan mesti mengandungi huruf besar, huruf kecil, dan angka"
    ),
  confirmPassword: z.string().min(1, "Pengesahan kata laluan diperlukan"),
});

export const studentRegisterSchema = baseRegisterSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata laluan tidak sepadan",
    path: ["confirmPassword"],
  });

export const employerRegisterSchema = baseRegisterSchema
  .extend({
    companyName: z
      .string()
      .min(2, "Nama syarikat diperlukan")
      .max(200, "Nama syarikat terlalu panjang"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata laluan tidak sepadan",
    path: ["confirmPassword"],
  });

export const providerRegisterSchema = baseRegisterSchema
  .extend({
    institutionName: z
      .string()
      .min(2, "Nama institusi diperlukan")
      .max(200, "Nama institusi terlalu panjang"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata laluan tidak sepadan",
    path: ["confirmPassword"],
  });

export type StudentRegisterInput  = z.infer<typeof studentRegisterSchema>;
export type EmployerRegisterInput = z.infer<typeof employerRegisterSchema>;
export type ProviderRegisterInput = z.infer<typeof providerRegisterSchema>;
