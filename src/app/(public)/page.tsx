import { Suspense } from "react";
import { HeroSection }  from "@/components/home/hero-section";
import { StatsBar }     from "@/components/home/stats-bar";
import { RoleGateway }  from "@/components/home/role-gateway";
import { WhyTvet }      from "@/components/home/why-tvet";
import { NewsGrid }         from "@/components/home/news-grid";
import { PartnersSection }  from "@/components/home/partners-section";
import { InquiryForm }      from "@/components/home/inquiry-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laman Web TVET Negeri Johor",
  description:
    "Portal Rasmi TVET Negeri Johor — menghubungkan bakat, industri, dan penyedia latihan untuk membangunkan ekosistem kemahiran negeri.",
};

// Force dynamic rendering — DB not available at build time on Vercel
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero + unified search */}
      <HeroSection />

      {/* 2. Floating stats bar (overlaps hero bottom) */}
      <StatsBar />

      {/* 3. Role selection gateway */}
      <RoleGateway />

      {/* 4. Why TVET section */}
      <WhyTvet />

      {/* 5. CMS News grid — data from DB, wrapped in Suspense */}
      <Suspense fallback={<NewsSkeleton />}>
        <NewsGrid />
      </Suspense>

      {/* 6. Rakan Strategik / Partners logos */}
      <PartnersSection />

      {/* 7. Inquiry / Contact section */}
      <section className="bg-gray-50 py-20" aria-labelledby="inquiry-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-red-500">
                Hubungi Kami
              </p>
              <h2
                id="inquiry-heading"
                className="font-heading text-3xl font-bold text-johor-navy-700 sm:text-4xl"
              >
                Ada Pertanyaan?
              </h2>
              <p className="mt-3 text-gray-500">
                Hantar mesej kepada pasukan kami dan kami akan membalas dalam masa 2–3 hari bekerja.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Lightweight skeleton shown while NewsGrid fetches from DB
function NewsSkeleton() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-8 w-56 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 rounded-xl border p-4">
                <div className="h-20 w-24 shrink-0 animate-pulse rounded-lg bg-gray-200" />
                <div className="flex flex-1 flex-col gap-2 py-1">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
