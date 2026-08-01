"use server";

import { requireRole }          from "@/lib/session";
import { prisma }               from "@/lib/prisma";
import { DocumentStatusBadge }  from "@/components/upload/document-status-badge";
import { reviewDocumentAction } from "@/app/actions/documents";
import { formatDate }           from "@/lib/utils";
import { FileText, ImageIcon }  from "lucide-react";
import type { Metadata }         from "next";

export const metadata: Metadata = { title: "Semakan Dokumen" };

export default async function AdminDocumentReviewPage() {
  await requireRole(["SUPERADMIN", "ADMIN_ADTEC", "ADMIN_JTDC"]);

  const pendingDocs = await prisma.document.findMany({
    where:   { status: { in: ["PENDING_REVIEW", "REQUIRES_REVISION"] } },
    orderBy: { createdAt: "asc" },
    select: {
      id:           true,
      fileName:     true,
      fileSizeBytes: true,
      mimeType:     true,
      documentType: true,
      status:       true,
      reviewNote:   true,
      createdAt:    true,
      fileKey:      true,
      uploader: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Semakan Dokumen</h1>
        <p className="mt-1 text-sm text-gray-500">
          {pendingDocs.length} dokumen menunggu semakan
        </p>
      </div>

      {pendingDocs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <FileText className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">Tiada dokumen menunggu semakan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              {/* Doc info */}
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  {doc.mimeType === "application/pdf" ? (
                    <FileText className="h-5 w-5 text-johor-red-500" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-gray-800">{doc.fileName}</p>
                    <DocumentStatusBadge status={doc.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>{doc.documentType}</span>
                    <span>·</span>
                    <span>{(doc.fileSizeBytes / 1024).toFixed(0)} KB</span>
                    <span>·</span>
                    <span>Dimuat naik oleh: <strong>{doc.uploader.name}</strong> ({doc.uploader.email})</span>
                    <span>·</span>
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Review form */}
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const action     = formData.get("action") as string;
                  const reviewNote = formData.get("reviewNote") as string | undefined;

                  await reviewDocumentAction({
                    documentId: doc.id,
                    status:     action as "APPROVED" | "REJECTED" | "REQUIRES_REVISION",
                    reviewNote: reviewNote || undefined,
                  });
                }}
                className="mt-3 space-y-3 border-t border-gray-100 pt-4"
              >
                <textarea
                  name="reviewNote"
                  rows={2}
                  placeholder="Nota untuk pemohon (wajib jika meminta pindaan atau menolak)…"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-johor-navy-300 focus:ring-1 focus:ring-johor-navy-200 resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    name="action"
                    value="APPROVED"
                    className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                  >
                    ✓ Luluskan
                  </button>
                  <button
                    type="submit"
                    name="action"
                    value="REQUIRES_REVISION"
                    className="rounded-lg bg-orange-400 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                  >
                    ↩ Minta Pindaan
                  </button>
                  <button
                    type="submit"
                    name="action"
                    value="REJECTED"
                    className="rounded-lg bg-johor-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-johor-red-600"
                  >
                    ✕ Tolak
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
