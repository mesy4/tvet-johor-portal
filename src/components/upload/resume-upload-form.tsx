"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeUploadSchema, type ResumeUploadInput } from "@/lib/validations/document";
import { confirmUploadAction } from "@/app/actions/documents";
import { FileUploader, type UploadedFile } from "@/components/upload/file-uploader";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText } from "lucide-react";

interface ResumeUploadFormProps {
  onSuccess?: (documentId: string) => void;
}

export function ResumeUploadForm({ onSuccess }: ResumeUploadFormProps) {
  const [submitResult, setSubmitResult] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ResumeUploadInput>({ resolver: zodResolver(resumeUploadSchema) });

  const hasFile = !!watch("fileKey");

  function handleFileUploaded(file: UploadedFile) {
    setValue("fileKey",       file.fileKey,       { shouldValidate: true });
    setValue("fileName",      file.fileName,       { shouldValidate: true });
    setValue("fileSizeBytes", file.fileSizeBytes,  { shouldValidate: true });
    setValue("mimeType",      file.mimeType as ResumeUploadInput["mimeType"], { shouldValidate: true });
    setSubmitResult(null);
  }

  function handleFileCleared() {
    setValue("fileKey",       "");
    setValue("fileName",      "");
    setValue("fileSizeBytes", 0);
    setValue("mimeType",      "application/pdf");
    setSubmitResult(null);
  }

  async function onSubmit(data: ResumeUploadInput) {
    setSubmitResult(null);
    const result = await confirmUploadAction({
      fileKey:       data.fileKey,
      fileName:      data.fileName,
      fileSizeBytes: data.fileSizeBytes,
      mimeType:      data.mimeType,
      documentType:  "RESUME",
    });

    if (!result.success) {
      setSubmitResult({ type: "error", message: result.error ?? "Ralat tidak dijangka." });
      return;
    }
    setSubmitResult({ type: "success", message: "Resume berjaya dihantar untuk semakan!" });
    if (result.documentId) onSuccess?.(result.documentId);
  }

  if (submitResult?.type === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className="font-heading text-lg font-semibold text-gray-800">Resume Dihantar!</h3>
        <p className="max-w-sm text-sm text-gray-500">{submitResult.message}</p>
        <p className="text-xs text-gray-400">
          Pihak admin akan menyemak dokumen anda. Anda akan dimaklumkan melalui dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-johor-navy-50">
          <FileText className="h-5 w-5 text-johor-navy-600" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-gray-900">Muat Naik Resume</h2>
          <p className="text-sm text-gray-500">Muat naik resume terkini anda dalam format PDF</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FileUploader
          documentType="RESUME"
          label="Resume (CV)"
          hint="Hanya PDF · Maksimum 5 MB"
          required
          onUploaded={handleFileUploaded}
          onCleared={handleFileCleared}
        />

        {errors.fileKey && (
          <p className="text-xs text-johor-red-500">{errors.fileKey.message}</p>
        )}

        {/* Tips */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="mb-2 text-xs font-semibold text-blue-700">Tips Resume yang Baik:</p>
          <ul className="space-y-1 text-xs text-blue-600">
            <li>• Pastikan resume tidak melebihi 2 halaman</li>
            <li>• Sertakan maklumat kemahiran dan pengalaman terkini</li>
            <li>• Gunakan font yang mudah dibaca (Arial, Calibri)</li>
            <li>• Simpan dalam format PDF sebelum muat naik</li>
          </ul>
        </div>

        {submitResult?.type === "error" && (
          <div role="alert" className="rounded-xl border border-johor-red-100 bg-johor-red-50 px-4 py-3 text-sm text-johor-red-700">
            {submitResult.message}
          </div>
        )}

        <Button
          type="submit"
          variant="navy"
          size="lg"
          disabled={isSubmitting || !hasFile}
          className="w-full"
        >
          {isSubmitting ? "Menghantar…" : "Hantar Resume untuk Semakan"}
        </Button>
      </form>
    </div>
  );
}
