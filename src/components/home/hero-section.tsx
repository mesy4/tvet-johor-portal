"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const SEARCH_TABS = [
  { id: "vacancy",  label: "Peluang Kerja" },
  { id: "training", label: "Program Latihan" },
  { id: "provider", label: "Pusat Latihan" },
] as const;

type SearchTab = (typeof SEARCH_TABS)[number]["id"];

export function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>("vacancy");
  const [query, setQuery]         = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/direktori/${activeTab}?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-johor-navy-900 via-johor-navy-700 to-johor-navy-500 pb-28 pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-johor-red-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-johor-gold/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        {/* Badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-johor-gold" />
          Portal Rasmi TVET Negeri Johor
        </span>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          Membangunkan Kemahiran.{" "}
          <span className="text-johor-red-400">Memperkasa Johor.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          Platform penyelarasan rasmi TVET yang menghubungkan bakat, industri, dan
          penyedia latihan untuk memenuhi keperluan tenaga kerja negeri Johor.
        </p>

        {/* Search box */}
        <div className="mx-auto mt-10 max-w-2xl">
          {/* Tabs */}
          <div className="mb-3 flex justify-center gap-1">
            {SEARCH_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-johor-navy-700"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSearch}
            className="flex overflow-hidden rounded-xl bg-white shadow-2xl"
            role="search"
            aria-label={`Cari ${SEARCH_TABS.find((t) => t.id === activeTab)?.label}`}
          >
            <Search className="ml-4 mt-3.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === "vacancy"
                  ? "Cari jawatan, syarikat, atau lokasi…"
                  : activeTab === "training"
                  ? "Cari program latihan atau kemahiran…"
                  : "Cari pusat latihan di Johor…"
              }
              className="flex-1 bg-transparent py-4 pl-3 pr-2 text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            <Button
              type="submit"
              variant="navy"
              className="m-1.5 shrink-0 rounded-lg"
            >
              Cari
            </Button>
          </form>

          {/* Quick links */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Teknologi Maklumat", "Automotif", "Pembinaan", "Hospitaliti", "Logistik"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setQuery(tag);
                    router.push(`/direktori/vacancy?q=${encodeURIComponent(tag)}`);
                  }}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/75 transition-colors hover:border-johor-gold/50 hover:bg-white/20 hover:text-white"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
