import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log Masuk",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-johor-navy-900 via-johor-navy-700 to-johor-navy-500 flex items-center justify-center p-4">
      {/* Decorative background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden opacity-10"
      >
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-johor-red-500 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-johor-gold blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Portal branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <span className="text-3xl">🇲🇾</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Laman Web TVET Negeri Johor
          </h1>
          <p className="mt-1 text-sm text-white/70">
            ADTEC JTM Kampus Pasir Gudang &amp; JTDC
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
