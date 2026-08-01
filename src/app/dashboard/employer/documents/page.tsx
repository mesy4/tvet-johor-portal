import { requireRole }           from "@/lib/session";
import { prisma }                from "@/lib/prisma";
import { EmployerDocsForm }      from "@/components/upload/employer-docs-form";
import { DocumentList }          from "@/components/upload/document-list";
import type { Metadata }          from "next";

export const metadata: Metadata = { title: "Pengesahan Syarikat" };

export default async function EmployerDocumentsPage() {
  const session = await requireRole("EMPLOYER");

  const [documents, profile] = await Promise.all([
    prisma.document.findMany({
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
    }),
    prisma.employerProfile.findUnique({
      where:  { userId: session.user.id },
      select: { isVerified: true, verifiedAt: true, companyName: true },
    }),
  ]);

  const isFullyVerified = profile?.isVerified ?? false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Pengesahan Syarikat</h1>
          <p className="mt-1 text-sm text-gray-500">
            Muat naik dokumen syarikat untuk mendapatkan pengesahan dan mula menyiar iklan kerja.
          </p>
        </div>
        {isFullyVerified && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
            ✓ Syarikat Disahkan
          </span>
        )}
      </div>

      {/* Verification checklist */}
      {!isFullyVerified && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
          <p className="font-semibold text-amber-800">Pengesahan Diperlukan</p>
          <p className="mt-1 text-sm text-amber-700">
            Muat naik dokumen SSM dan MOF untuk mengesahkan {profile?.companyName ?? "syarikat anda"}.
            Setelah disahkan, anda boleh mula menyiar iklan pekerjaan.
          </p>
        </div>
      )}

      {/* Upload form */}
      <EmployerDocsForm />

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
