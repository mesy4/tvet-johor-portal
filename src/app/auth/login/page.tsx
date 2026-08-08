"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginAction } from "@/app/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { getRedirectForRole } from "@/lib/rbac";
import type { UserRole } from "@prisma/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const verified = searchParams.get("verified");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const fd = new FormData();
    fd.set("email", data.email);
    fd.set("password", data.password);

    const result = await loginAction(fd);
    if (!result.success) {
      setServerError(result.error ?? "Ralat tidak dijangka.");
      return;
    }
    // After successful login, fetch session to determine role-based redirect
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role as UserRole | undefined;
      // If callbackUrl is provided (e.g., from middleware redirect), use it
      // Otherwise redirect to role-appropriate dashboard
      const target = callbackUrl ?? (role ? getRedirectForRole(role) : "/");
      router.push(target);
      router.refresh();
    } catch {
      // Fallback: use callbackUrl if available, otherwise redirect to home
      router.push(callbackUrl ?? "/");
      router.refresh();
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
      <h2 className="mb-6 text-center font-heading text-xl font-semibold text-white">
        Log Masuk ke Portal
      </h2>

      {verified === "true" && (
        <div role="status" className="mb-5 rounded-lg bg-green-500/20 border border-green-500/40 px-4 py-3 text-sm text-green-200">
          Akaun anda telah berjaya disahkan! Sila log masuk.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
            Alamat Emel
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-johor-gold focus:ring-2 focus:ring-johor-gold/30"
            placeholder="nama@contoh.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-johor-red-300">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-white/80">
              Kata Laluan
            </label>
            <Link href="/auth/forgot-password" className="text-xs text-johor-gold hover:underline">
              Lupa kata laluan?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-johor-gold focus:ring-2 focus:ring-johor-gold/30"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-johor-red-300">{errors.password.message}</p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <div role="alert" className="rounded-lg bg-johor-red-500/20 border border-johor-red-500/40 px-4 py-3 text-sm text-red-200">
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-johor-navy-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-johor-navy-600 focus:outline-none focus:ring-2 focus:ring-johor-gold disabled:opacity-60"
        >
          {isSubmitting ? "Sedang log masuk…" : "Log Masuk"}
        </button>
      </form>

      {/* Registration links */}
      <div className="mt-6 border-t border-white/10 pt-6 text-center">
        <p className="text-sm text-white/60">Belum ada akaun?</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { href: "/auth/register/student",  label: "Pelajar" },
            { href: "/auth/register/employer", label: "Majikan" },
            { href: "/auth/register/provider", label: "Pusat Latihan" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-white/20 py-2 text-xs font-medium text-white/70 transition hover:border-johor-gold hover:text-johor-gold"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
          <svg className="h-10 w-10 animate-spin text-johor-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="mb-3 font-heading text-xl font-semibold text-white">Log Masuk</h2>
        <p className="text-sm text-white/60">Sedang memuatkan…</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
