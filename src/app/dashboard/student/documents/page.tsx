import { requireRole }          from "@/lib/session";
import { prisma }               from "@/lib/prisma";
import { ResumeUploadForm }     from "@/components/upload/resume-upload-form";
import { DocumentList }         from "@/components/upload/document-list";
import type { Metadata }         from "next";

export const metadata: Metadata = { title: "Dokumen Saya" };

export default async function StudentDocumentsPage() {
  const session = await requireRole("STUDENT");

  const documents = await prisma.document.findMany({
    where:   { uploaderId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id:            true,
      fileName:      true,
      fileSizeBytes: true,
      mimeType:      true,
      documentType:  true,
      status:        true,
      reviewNote:    true,
      createdAt:     true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Dokumen Saya</h1>
        <p className="mt-1 text-sm text-gray-500">
          Urus resume dan surat mohon anda. Dokumen akan disemak oleh admin sebelum digunakan.
        </p>
      </div>

      {/* Upload section */}
      <ResumeUploadForm />

      {/* Existing documents */}
      <div>
        <h2 className="mb-4 font-heading text-lg font-semibold text-gray-800">
          Dokumen Dimuat Naik
        </h2>
        <DocumentList documents={documents} />
      </div>
    </div>
  );
}
