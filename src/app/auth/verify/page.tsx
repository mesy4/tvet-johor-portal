"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Sedang mengesahkan akaun anda…");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token pengesahan tidak ditemui.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token ?? "")}`, {
          redirect: "follow",
        });

        if (res.redirected) {
          const url = new URL(res.url);
          if (url.searchParams.get("verified") === "true") {
            setStatus("success");
            setMessage("Akaun anda telah berjaya disahkan!");
            setTimeout(() => {
              window.location.href = "/auth/login?verified=true";
            }, 2000);
          } else {
            setStatus("error");
            setMessage("Token pengesahan tidak sah atau telah tamat tempoh.");
          }
        } else {
          setStatus("error");
          setMessage("Ralat semasa mengesahkan akaun. Sila cuba lagi.");
        }
      } catch {
        setStatus("error");
        setMessage("Ralat sambungan. Sila cuba lagi.");
      }
    }

    verify();
  }, [token]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md text-center">
      {status === "loading" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
            <svg
              className="h-10 w-10 animate-spin text-johor-gold"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <h2 className="mb-3 font-heading text-xl font-semibold text-white">
            Mengesahkan Akaun
          </h2>
          <p className="text-sm text-white/60">{message}</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-johor-green-500/20">
            <svg
              className="h-8 w-8 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-3 font-heading text-xl font-semibold text-white">
            Pengesahan Berjaya!
          </h2>
          <p className="mb-6 text-sm text-white/60">{message}</p>
          <Link
            href="/auth/login?verified=true"
            className="inline-block rounded-lg bg-johor-navy-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-johor-navy-600 focus:outline-none focus:ring-2 focus:ring-johor-gold"
          >
            Log Masuk Sekarang
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-johor-red-500/20">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mb-3 font-heading text-xl font-semibold text-white">
            Pengesahan Gagal
          </h2>
          <p className="mb-6 text-sm text-white/60">{message}</p>
          <Link
            href="/auth/login"
            className="inline-block rounded-lg bg-johor-navy-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-johor-navy-600 focus:outline-none focus:ring-2 focus:ring-johor-gold"
          >
            Kembali ke Log Masuk
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
          <svg className="h-10 w-10 animate-spin text-johor-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="mb-3 font-heading text-xl font-semibold text-white">Mengesahkan Akaun</h2>
        <p className="text-sm text-white/60">Sedang mengesahkan akaun anda…</p>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}