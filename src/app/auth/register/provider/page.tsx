"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { providerRegisterSchema, type ProviderRegisterInput } from "@/lib/validations/auth";
import { registerProviderAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProviderRegisterInput>({ resolver: zodResolver(providerRegisterSchema) });

  async function onSubmit(data: ProviderRegisterInput) {
    setServerError(null);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.set(k, v));
    const result = await registerProviderAction(fd);
    if (!result.success) {
      setServerError(result.error ?? "Ralat tidak dijangka.");
      return;
    }
    setSuccessMessage(result.error ?? "Sila semak emel anda untuk mengesahkan akaun.");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
      <h2 className="mb-2 text-center font-heading text-xl font-semibold text-white">
        Daftar sebagai Pusat Latihan
      </h2>
      <p className="mb-6 text-center text-sm text-white/60">
        Siarkan program latihan dan jejak perkembangan peserta
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {[
          { id: "institutionName", label: "Nama Institusi",       type: "text",     placeholder: "ADTEC / ILP / etc.",  autoComplete: "organization" },
          { id: "name",            label: "Nama Pegawai Daftar",  type: "text",     placeholder: "Nama anda",           autoComplete: "name" },
          { id: "email",           label: "Emel Institusi",       type: "email",    placeholder: "info@institusi.edu.my", autoComplete: "email" },
          { id: "password",        label: "Kata Laluan",          type: "password", placeholder: "Min. 8 aksara",        autoComplete: "new-password" },
          { id: "confirmPassword", label: "Sahkan Kata Laluan",   type: "password", placeholder: "Ulangi kata laluan",  autoComplete: "new-password" },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-white/80">
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              {...register(field.id as keyof ProviderRegisterInput)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-johor-gold focus:ring-2 focus:ring-johor-gold/30"
            />
            {errors[field.id as keyof ProviderRegisterInput] && (
              <p className="mt-1 text-xs text-johor-red-300">
                {errors[field.id as keyof ProviderRegisterInput]?.message}
              </p>
            )}
          </div>
        ))}

        {serverError && (
          <div role="alert" className="rounded-lg bg-johor-red-500/20 border border-johor-red-500/40 px-4 py-3 text-sm text-red-200">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div role="status" className="rounded-lg bg-green-500/20 border border-green-500/40 px-4 py-3 text-sm text-green-200">
            {successMessage}
            <div className="mt-2 flex gap-2">
              <Link href="/auth/login" className="text-johor-gold underline text-xs hover:text-white">
                Log Masuk
              </Link>
              <span className="text-white/40 text-xs">|</span>
              <Link href="/auth/verify/resend" className="text-johor-gold underline text-xs hover:text-white">
                Hantar semula pautan pengesahan
              </Link>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-johor-navy-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-johor-navy-600 focus:outline-none focus:ring-2 focus:ring-johor-gold disabled:opacity-60"
        >
          {isSubmitting ? "Mendaftar…" : "Daftar Akaun"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-white/60">
        Sudah ada akaun?{" "}
        <Link href="/auth/login" className="text-johor-gold hover:underline">
          Log Masuk
        </Link>
      </p>
    </div>
  );
}
