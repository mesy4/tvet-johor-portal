"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { confirmUploadSchema } from "@/lib/validations/document";
import { deleteS3Object, generatePresignedReadUrl } from "@/lib/storage";
import type { DocumentType } from "@prisma/client";

export type DocumentActionResult = {
  success: boolean;
  error?:  string;
  documentId?: string;
};

// ─────────────────────────────────────────────────────────────
// CONFIRM UPLOAD
// Called after the client has successfully PUT the file to S3.
// Creates a Document record in the DB linked to the user.
// ─────────────────────────────────────────────────────────────
export async function confirmUploadAction(
  payload: unknown
): Promise<DocumentActionResult> {
  const session = await requireSession();

  const parsed = confirmUploadSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Data tidak sah." };
  }

  const { fileKey, fileName, fileSizeBytes, mimeType, documentType } = parsed.data;

  // Generate a long-lived read URL for storage in DB
  // (or use the fileKey directly and generate on-demand)
  const fileUrl = await generatePresignedReadUrl(fileKey, 60 * 60 * 24 * 7); // 7 days

  // Resolve profile IDs based on role
  let studentProfileId: string | undefined;
  let employerProfileId: string | undefined;

  if (session.user.role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({
      where:  { userId: session.user.id },
      select: { id: true },
    });
    if (!profile) return { success: false, error: "Profil pelajar tidak dijumpai." };
    studentProfileId = profile.id;
  } else if (session.user.role === "EMPLOYER") {
    const profile = await prisma.employerProfile.findUnique({
      where:  { userId: session.user.id },
      select: { id: true },
    });
    if (!profile) return { success: false, error: "Profil majikan tidak dijumpai." };
    employerProfileId = profile.id;
  }

  try {
    const doc = await prisma.document.create({
      data: {
        uploaderId:       session.user.id,
        fileName,
        fileKey,
        fileUrl,
        fileSizeBytes,
        mimeType,
        documentType:     documentType as DocumentType,
        status:           "PENDING_REVIEW",
        studentProfileId: studentProfileId ?? null,
        employerProfileId: employerProfileId ?? null,
      },
      select: { id: true },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId:     session.user.id,
        action:      "UPLOAD",
        entityType:  "Document",
        entityId:    doc.id,
        description: `Uploaded ${documentType}: ${fileName}`,
      },
    });

    return { success: true, documentId: doc.id };
  } catch {
    // If DB insert fails, clean up the orphan S3 object
    await deleteS3Object(fileKey).catch(() => {});
    return { success: false, error: "Gagal menyimpan rekod dokumen." };
  }
}

// ─────────────────────────────────────────────────────────────
// GET USER DOCUMENTS
// ─────────────────────────────────────────────────────────────
export async function getUserDocumentsAction(documentType?: DocumentType) {
  const session = await requireSession();

  return prisma.document.findMany({
    where: {
      uploaderId:   session.user.id,
      ...(documentType ? { documentType } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id:           true,
      fileName:     true,
      fileKey:      true,
      fileSizeBytes: true,
      mimeType:     true,
      documentType: true,
      status:       true,
      reviewNote:   true,
      createdAt:    true,
      updatedAt:    true,
    },
  });
}

// ─────────────────────────────────────────────────────────────
// DELETE DOCUMENT  (owner or admin only)
// ─────────────────────────────────────────────────────────────
export async function deleteDocumentAction(
  documentId: string
): Promise<DocumentActionResult> {
  const session = await requireSession();

  const doc = await prisma.document.findUnique({
    where:  { id: documentId },
    select: { id: true, fileKey: true, uploaderId: true },
  });

  if (!doc) return { success: false, error: "Dokumen tidak dijumpai." };

  // Only the owner or an admin can delete
  const isAdmin = ["SUPERADMIN", "ADMIN_ADTEC", "ADMIN_JTDC"].includes(session.user.role);
  if (doc.uploaderId !== session.user.id && !isAdmin) {
    return { success: false, error: "Tidak dibenarkan." };
  }

  await Promise.all([
    prisma.document.delete({ where: { id: documentId } }),
    deleteS3Object(doc.fileKey).catch(() => {}), // best-effort S3 cleanup
    prisma.auditLog.create({
      data: {
        actorId:     session.user.id,
        action:      "DELETE",
        entityType:  "Document",
        entityId:    documentId,
        description: `Deleted document ${documentId}`,
      },
    }),
  ]);

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// ADMIN: REVIEW DOCUMENT
// ─────────────────────────────────────────────────────────────
export async function reviewDocumentAction(params: {
  documentId:  string;
  status:      "APPROVED" | "REJECTED" | "REQUIRES_REVISION";
  reviewNote?: string;
}): Promise<DocumentActionResult> {
  const session = await requireSession();

  const isAdmin = ["SUPERADMIN", "ADMIN_ADTEC", "ADMIN_JTDC"].includes(session.user.role);
  if (!isAdmin) return { success: false, error: "Akses ditolak." };

  const { documentId, status, reviewNote } = params;

  await prisma.document.update({
    where: { id: documentId },
    data: {
      status,
      reviewNote: reviewNote ?? null,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId:     session.user.id,
      action:      status === "APPROVED" ? "APPROVE" : "REJECT",
      entityType:  "Document",
      entityId:    documentId,
      description: `Document ${status.toLowerCase()}: ${reviewNote ?? ""}`,
    },
  });

  return { success: true };
}
