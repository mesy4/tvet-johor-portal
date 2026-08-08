"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employerDocsSchema, type EmployerDocsInput } from "@/lib/validations/document";
import { confirmUploadAction } from "@/app/actions/documents";
import { FileUploader, type UploadedFile } from "@/components/upload/file-uploader";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Building2, ShieldCheck, Landmark } from "lucide-react";
import type { DocumentType } from "@prisma/client";

interface EmployerDocsFormProps {
  onSuccess?: () => void;
}

type DocField = "ssm" | "mof" | "bankStatement";

const DOC_CONFIG: Record<
  DocField,
  { label: string; hint: string; icon: React.ElementType; type: DocumentType; required: boolean; description: string }
> = {
  ssm: {
    label:       "Sijil Pendaftaran SSM",
    hint:        "PDF atau imej · Maks 5 MB",
    icon:        Building2,
    type:        "SSM",
    required:    true,
    description: "Suruhanjaya Syarikat Malaysia — pendaftaran syarikat yang sah",
  },
  mof: {
    label:       "Sijil Pendaftaran MOF",
    hint:        "PDF atau imej · Maks 5 MB",
    icon:        ShieldCheck,
    type:        "MOF",
    required:    true,
    description: "Kementerian Kewangan — kod bidang dan tarikh luput",
  },
  bankStatement: {
    label:       "Penyata Bank (Pilihan)",
    hint:        "PDF atau imej · Maks 5 MB",
    icon:        Landmark,
    type:        "BANK_STATEMENT",
    required:    false,
    description: "Penyata bank 3 bulan terkini — disyorkan untuk pengesahan lebih cepat",
  },
};

export function EmployerDocsForm({ onSuccess }: EmployerDocsFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Partial<Record<DocField, UploadedFile>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployerDocsInput>({ resolver: zodResolver(employerDocsSchema) });

  function handleFileUploaded(field: DocField) {
    return (file: UploadedFile) => {
      setUploadedFiles((prev) => ({ ...prev, [field]: file }));
      setValue(field, {
        fileKey:       file.fileKey,
        fileName:      file.fileName,
        fileSizeBytes: file.fileSizeBytes,
        mimeType:      file.mimeType as EmployerDocsInput["ssm"]["mimeType"],
      } as EmployerDocsInput[typeof field], { shouldValidate: true });
      setSubmitResult(null);
    };
  }

  function handleFileCleared(field: DocField) {
    return () => {
      setUploadedFiles((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      // intentionally clearing optional nested field
      setValue(field, undefined, { shouldValidate: false });
      setSubmitResult(null);
    };
  }

  async function onSubmit(data: EmployerDocsInput) {
    setIsSubmitting(true);
    setSubmitResult(null);

    const docs: Array<{ data: UploadedFile; type: DocumentType }> = [
      { data: uploadedFiles.ssm!,           type: "SSM" },
      { data: uploadedFiles.mof!,           type: "MOF" },
      ...(uploadedFiles.bankStatement
        ? [{ data: uploadedFiles.bankStatement, type: "BANK_STATEMENT" as DocumentType }]
        : []),
    ];

    const results = await Promise.all(
      docs.map((doc) =>
        confirmUploadAction({
          fileKey:       doc.data.fileKey,
          fileName:      doc.data.fileName,
          fileSizeBytes: doc.data.fileSizeBytes,
          mimeType:      doc.data.mimeType,
          documentType:  doc.type,
        })
      )
    );

    const failed = results.find((r) => !r.success);
    if (failed) {
      setSubmitResult({ type: "error", message: failed.error ?? "Ralat semasa menghantar dokumen." });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setSubmitResult({ type: "success", message: "Semua dokumen berjaya dihantar untuk semakan!" });
    onSuccess?.();
  }

  if (submitResult?.type === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className="font-heading text-lg font-semibold text-gray-800">Dokumen Dihantar!</h3>
        <p className="max-w-md text-sm text-gray-500">{submitResult.message}</p>
        <div className="rounded-lg border border-green-200 bg-white px-5 py-4 text-left text-sm text-gray-600">
          <p className="mb-2 font-medium">Proses Seterusnya:</p>
          <ol className="list-decimal space-y-1 pl-4 text-xs text-gray-500">
            <li>Admin akan menyemak dokumen dalam 2–3 hari bekerja</li>
            <li>Anda akan dimaklumkan melalui dashboard jika pindaan diperlukan</li>
            <li>Setelah diluluskan, akaun syarikat anda akan disahkan</li>
          </ol>
        </div>
      </div>
    );
  }

  const canSubmit = !!uploadedFiles.ssm && !!uploadedFiles.mof;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-semibold text-gray-900">
          Pengesahan Dokumen Syarikat
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Muat naik dokumen berikut untuk mengesahkan kelayakan syarikat anda.
          Dokumen akan disemak oleh admin dalam 2–3 hari bekerja.
        </p>
      </div>

      {/* Status pipeline explainer */}
      <div className="mb-7 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        {[
          { step: "1", label: "Muat Naik",       active: true },
          { step: "2", label: "Dalam Semakan",   active: false },
          { step: "3", label: "Pindaan (jika ada)", active: false },
          { step: "4", label: "Diluluskan",      active: false },
        ].map((s, i, arr) => (
          <div key={s.step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                s.active
                  ? "bg-johor-navy-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {s.step}
              </div>
              <span className={`hidden text-xs sm:block ${s.active ? "font-medium text-johor-navy-600" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div className="mx-2 h-px w-8 bg-gray-200 sm:w-12" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {(Object.keys(DOC_CONFIG) as DocField[]).map((field) => {
          const config = DOC_CONFIG[field];
          const Icon   = config.icon;
          return (
            <div
              key={field}
              className="rounded-xl border border-gray-100 bg-gray-50 p-5"
            >
              {/* Doc type header */}
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-johor-navy-50">
                  <Icon className="h-4 w-4 text-johor-navy-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {config.label}
                    {config.required && <span className="ml-0.5 text-johor-red-500">*</span>}
                  </p>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
              </div>

              <FileUploader
                documentType={config.type}
                label={config.label}
                hint={config.hint}
                required={config.required}
                onUploaded={handleFileUploaded(field)}
                onCleared={handleFileCleared(field)}
              />

              {/* dynamic nested errors */}
              {errors[field] && (
                <p className="mt-1 text-xs text-johor-red-500">
                  {errors[field]?.fileKey?.message ?? errors[field]?.message}
                </p>
              )}
            </div>
          );
        })}

        {submitResult?.type === "error" && (
          <div role="alert" className="rounded-xl border border-johor-red-100 bg-johor-red-50 px-4 py-3 text-sm text-johor-red-700">
            {submitResult.message}
          </div>
        )}

        <Button
          type="submit"
          variant="navy"
          size="lg"
          disabled={isSubmitting || !canSubmit}
          className="w-full"
        >
          {isSubmitting
            ? "Menghantar dokumen…"
            : `Hantar Dokumen untuk Semakan${!canSubmit ? " (SSM & MOF diperlukan)" : ""}`
          }
        </Button>
      </form>
    </div>
  );
}
