import { FileText, ImageIcon, AlertCircle, Trash2, ExternalLink } from "lucide-react";
import { DocumentStatusBadge } from "@/components/upload/document-status-badge";
import { formatDate } from "@/lib/utils";
import type { DocumentStatus, DocumentType } from "@prisma/client";

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  RESUME:            "Resume",
  COVER_LETTER:      "Surat Mohon",
  SSM:               "Sijil SSM",
  MOF:               "Sijil MOF",
  BANK_STATEMENT:    "Penyata Bank",
  CERT_PROFESSIONAL: "Sijil Profesional",
  OTHER:             "Lain-lain",
};

type DocumentItem = {
  id:            string;
  fileName:      string;
  fileSizeBytes: number;
  mimeType:      string;
  documentType:  DocumentType;
  status:        DocumentStatus;
  reviewNote:    string | null;
  createdAt:     Date;
};

interface DocumentListProps {
  documents: DocumentItem[];
  onDelete?: (id: string) => void;
  onView?:   (id: string) => void;
}

export function DocumentList({ documents, onDelete, onView }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-12 text-center">
        <FileText className="h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-400">Tiada dokumen dimuat naik lagi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          {/* File icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            {doc.mimeType === "application/pdf" ? (
              <FileText className="h-5 w-5 text-johor-red-500" />
            ) : (
              <ImageIcon className="h-5 w-5 text-blue-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-medium text-gray-800">{doc.fileName}</p>
              <DocumentStatusBadge status={doc.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span>{DOC_TYPE_LABELS[doc.documentType]}</span>
              <span>·</span>
              <span>{(doc.fileSizeBytes / 1024).toFixed(0)} KB</span>
              <span>·</span>
              <span>{formatDate(doc.createdAt)}</span>
            </div>

            {/* Revision note */}
            {doc.status === "REQUIRES_REVISION" && doc.reviewNote && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
                <p className="text-xs text-orange-700">
                  <span className="font-semibold">Nota pindaan: </span>
                  {doc.reviewNote}
                </p>
              </div>
            )}

            {doc.status === "REJECTED" && doc.reviewNote && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                <p className="text-xs text-red-700">
                  <span className="font-semibold">Sebab penolakan: </span>
                  {doc.reviewNote}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1">
            {onView && (
              <button
                onClick={() => onView(doc.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Lihat dokumen"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(doc.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-johor-red-500"
                aria-label="Padam dokumen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
