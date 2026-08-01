"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/validations/document";
import type { DocumentType } from "@prisma/client";

export type UploadedFile = {
  fileKey:       string;
  fileName:      string;
  fileSizeBytes: number;
  mimeType:      string;
};

type UploadState =
  | { type: "idle" }
  | { type: "validating" }
  | { type: "uploading"; progress: number }
  | { type: "success"; file: UploadedFile }
  | { type: "error"; message: string };

interface FileUploaderProps {
  documentType: DocumentType;
  label:        string;
  hint?:        string;
  required?:    boolean;
  onUploaded:   (file: UploadedFile) => void;
  onCleared?:   () => void;
  className?:   string;
}

export function FileUploader({
  documentType,
  label,
  hint,
  required = false,
  onUploaded,
  onCleared,
  className,
}: FileUploaderProps) {
  const [state, setState] = useState<UploadState>({ type: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Client-side validation ──────────────────────────────────
  function validateFile(file: File): string | null {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Jenis fail tidak dibenarkan. Sila gunakan: ${ALLOWED_EXTENSIONS.join(", ").toUpperCase()}`;
    }
    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
      return "Jenis MIME tidak dibenarkan.";
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Saiz fail melebihi had 5 MB (saiz semasa: ${(file.size / 1024 / 1024).toFixed(1)} MB).`;
    }
    return null;
  }

  // ── Main upload pipeline ────────────────────────────────────
  async function processFile(file: File) {
    setState({ type: "validating" });

    const validationError = validateFile(file);
    if (validationError) {
      setState({ type: "error", message: validationError });
      return;
    }

    // 1. Get presigned URL from our API
    setState({ type: "uploading", progress: 10 });

    let presignData: { fileKey: string; uploadUrl: string };
    try {
      const res = await fetch("/api/upload/presign", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          fileName:      file.name,
          mimeType:      file.type,
          fileSizeBytes: file.size,
          documentType,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Gagal mendapatkan URL muat naik.");
      }

      presignData = await res.json();
    } catch (err) {
      setState({ type: "error", message: err instanceof Error ? err.message : "Ralat rangkaian." });
      return;
    }

    // 2. PUT directly to S3 (no server bandwidth involved)
    setState({ type: "uploading", progress: 40 });
    try {
      const putRes = await fetch(presignData.uploadUrl, {
        method:  "PUT",
        headers: { "Content-Type": file.type },
        body:    file,
      });

      if (!putRes.ok) throw new Error("Muat naik ke storan gagal.");
    } catch (err) {
      setState({ type: "error", message: err instanceof Error ? err.message : "Ralat muat naik." });
      return;
    }

    // 3. Done — surface the file info to parent form
    setState({ type: "uploading", progress: 100 });
    const uploaded: UploadedFile = {
      fileKey:       presignData.fileKey,
      fileName:      file.name,
      fileSizeBytes: file.size,
      mimeType:      file.type,
    };
    setState({ type: "success", file: uploaded });
    onUploaded(uploaded);
  }

  // ── Event handlers ──────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentType]
  );

  function handleClear() {
    setState({ type: "idle" });
    if (inputRef.current) inputRef.current.value = "";
    onCleared?.();
  }

  // ── Render ──────────────────────────────────────────────────
  const isLoading = state.type === "validating" || state.type === "uploading";

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-johor-red-500">*</span>}
      </label>

      {state.type === "success" ? (
        // ── Success state ────────────────────────────────────
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">{state.file.fileName}</p>
            <p className="text-xs text-gray-500">
              {(state.file.fileSizeBytes / 1024).toFixed(0)} KB · Berjaya dimuat naik
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto shrink-0 rounded-lg p-1 text-gray-400 hover:bg-green-100 hover:text-gray-600"
            aria-label="Buang fail"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : state.type === "error" ? (
        // ── Error state ──────────────────────────────────────
        <div className="space-y-2">
          <div className="flex items-start gap-3 rounded-xl border border-johor-red-200 bg-johor-red-50 px-4 py-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-johor-red-500" />
            <p className="flex-1 text-sm text-johor-red-700">{state.message}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-johor-navy-600 underline"
          >
            Cuba lagi
          </button>
        </div>
      ) : (
        // ── Drop zone / idle / loading ────────────────────────
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isLoading && inputRef.current?.click()}
          role="button"
          tabIndex={isLoading ? -1 : 0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
          aria-label={`Muat naik ${label}`}
          aria-busy={isLoading}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            isDragging
              ? "border-johor-navy-400 bg-johor-navy-50"
              : "border-gray-200 hover:border-johor-navy-300 hover:bg-gray-50",
            isLoading && "cursor-not-allowed opacity-60"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-johor-navy-500" />
              <p className="text-sm font-medium text-gray-600">
                {state.type === "validating" ? "Mengesahkan fail…" : `Memuat naik… ${state.progress}%`}
              </p>
              {state.type === "uploading" && (
                <div className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-johor-navy-500 transition-all duration-300"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-johor-navy-50">
                <Upload className="h-5 w-5 text-johor-navy-500" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Seret &amp; lepas atau{" "}
                <span className="text-johor-navy-600 underline">klik untuk pilih fail</span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {hint ?? "PDF, JPG, PNG · Maksimum 5 MB"}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  );
}
