import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/validations/document";

// ── Supabase admin client (service role — server only) ────────
function getSupabaseAdmin() {
  const url        = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

const BUCKET_NAME = "tvet-documents";

// ── Build a scoped, collision-resistant object path ───────────
export function buildFileKey(
  ownerId:      string,
  documentType: string,
  originalName: string
): string {
  const ext  = originalName.split(".").pop()?.toLowerCase() ?? "bin";
  const uuid = randomUUID();
  const date = new Date().toISOString().split("T")[0];
  // e.g. documents/abc123/RESUME/2026-07-31_uuid.pdf
  return `documents/${ownerId}/${documentType}/${date}_${uuid}.${ext}`;
}

// ── Generate a Supabase signed upload URL (expires in 5 min) ──
export async function generatePresignedUploadUrl(params: {
  fileKey:       string;
  mimeType:      string;
  fileSizeBytes: number;
}): Promise<string> {
  const { fileKey, mimeType, fileSizeBytes } = params;

  // Server-side guard before issuing the URL
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)) {
    throw new Error("Jenis fail tidak dibenarkan.");
  }
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error("Saiz fail melebihi had 5 MB.");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(fileKey, { upsert: false });

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Gagal menjana URL muat naik.");
  }

  return data.signedUrl;
}

// ── Generate a signed read URL (expires 7 days by default) ────
export async function generatePresignedReadUrl(
  fileKey:   string,
  expiresIn: number = 60 * 60 * 24 * 7 // 7 days
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(fileKey, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Gagal menjana URL bacaan.");
  }

  return data.signedUrl;
}

// ── Delete a file from Supabase Storage ───────────────────────
export async function deleteS3Object(fileKey: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([fileKey]);

  if (error) throw new Error(error.message);
}
