import { z } from "zod";

// ── Shared constants ──────────────────────────────────────────
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];

// ── File upload request (client → presign API) ────────────────
export const presignRequestSchema = z.object({
  fileName:     z.string().min(1).max(255),
  mimeType:     z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: "Hanya fail PDF, JPG, atau PNG dibenarkan." }),
  }),
  fileSizeBytes: z
    .number()
    .int()
    .positive()
    .max(MAX_FILE_SIZE_BYTES, "Saiz fail melebihi had 5 MB."),
  documentType: z.enum([
    "RESUME",
    "COVER_LETTER",
    "SSM",
    "MOF",
    "BANK_STATEMENT",
    "CERT_PROFESSIONAL",
    "OTHER",
  ]),
});

export type PresignRequest = z.infer<typeof presignRequestSchema>;

// ── Confirm upload (client → confirm action after S3 PUT) ─────
export const confirmUploadSchema = z.object({
  fileKey:      z.string().min(1).max(500),
  fileName:     z.string().min(1).max(255),
  fileSizeBytes: z.number().int().positive().max(MAX_FILE_SIZE_BYTES),
  mimeType:     z.enum(ALLOWED_MIME_TYPES),
  documentType: presignRequestSchema.shape.documentType,
});

export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;

// ── Student resume form ───────────────────────────────────────
export const resumeUploadSchema = z.object({
  fileKey:      z.string().min(1, "Sila muat naik resume anda."),
  fileName:     z.string().min(1),
  fileSizeBytes: z.number().int().positive(),
  mimeType:     z.enum(ALLOWED_MIME_TYPES),
});

export type ResumeUploadInput = z.infer<typeof resumeUploadSchema>;

// ── Employer docs form ────────────────────────────────────────
export const employerDocsSchema = z.object({
  ssm: z.object({
    fileKey:      z.string().min(1, "Dokumen SSM diperlukan."),
    fileName:     z.string().min(1),
    fileSizeBytes: z.number().int().positive(),
    mimeType:     z.enum(ALLOWED_MIME_TYPES),
  }),
  mof: z.object({
    fileKey:      z.string().min(1, "Dokumen MOF diperlukan."),
    fileName:     z.string().min(1),
    fileSizeBytes: z.number().int().positive(),
    mimeType:     z.enum(ALLOWED_MIME_TYPES),
  }),
  bankStatement: z
    .object({
      fileKey:      z.string().min(1),
      fileName:     z.string().min(1),
      fileSizeBytes: z.number().int().positive(),
      mimeType:     z.enum(ALLOWED_MIME_TYPES),
    })
    .optional(),
});

export type EmployerDocsInput = z.infer<typeof employerDocsSchema>;
