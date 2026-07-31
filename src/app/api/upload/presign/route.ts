import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { presignRequestSchema } from "@/lib/validations/document";
import { buildFileKey, generatePresignedUploadUrl } from "@/lib/storage";

/**
 * POST /api/upload/presign
 *
 * Body: { fileName, mimeType, fileSizeBytes, documentType }
 * Returns: { fileKey, uploadUrl }
 *
 * The client then PUTs the file directly to Supabase Storage using uploadUrl.
 * On success, the client calls confirmUploadAction(fileKey) as a Server Action.
 *
 * Security:
 * - Requires authenticated session
 * - Validates mime type and file size server-side before issuing the URL
 * - File key is scoped to the user's ID (prevents path traversal)
 * - Supabase signed upload URLs are single-use and expire in 60 seconds
 */
export async function POST(req: NextRequest) {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak dibenarkan." }, { status: 401 });
  }

  // 2. Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Badan permintaan tidak sah." }, { status: 400 });
  }

  const parsed = presignRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Permintaan tidak sah.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { fileName, mimeType, fileSizeBytes, documentType } = parsed.data;

  // 3. Build a scoped file key — prevents path traversal
  const fileKey = buildFileKey(session.user.id, documentType, fileName);

  // 4. Generate Supabase signed upload URL
  try {
    const uploadUrl = await generatePresignedUploadUrl({ fileKey, mimeType, fileSizeBytes });
    return NextResponse.json({ fileKey, uploadUrl }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ralat pelayan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
