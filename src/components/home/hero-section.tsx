"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const SEARCH_TABS = [
  { id: "vacancy",  label: "Peluang Kerja" },
  { id: "training", label: "Program Latihan" },
  { id: "provider", label: "Pusat Latihan" },
] as const;

type SearchTab = (typeof SEARCH_TABS)[number]["id"];

// ── Animated canvas background ──────────────────────────────
// Draws flowing geometric waves in Johor navy/red tones
function useCanvasBackground(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const t = timeRef.current;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Dark navy base
    const baseGrad = ctx.createLinearGradient(0, 0, w, h);
    baseGrad.addColorStop(0, "#000a14");   // johor-navy-900
    baseGrad.addColorStop(0.5, "#001f3d"); // johor-navy-700
    baseGrad.addColorStop(1, "#002952");   // johor-navy-600
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // Animated flowing waves (sine-based)
    for (let wave = 0; wave < 3; wave++) {
      const offsetY = wave * (h / 3);
      const speed = 0.4 + wave * 0.2;
      const amplitude = h * 0.12 + wave * 10;

      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x += 4) {
        const dx = x / w;
        const y =
          offsetY +
          Math.sin(x * 0.008 + t * speed + wave * 2.1) * amplitude * 0.5 +
          Math.cos(x * 0.015 + t * speed * 0.7) * amplitude * 0.3;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      // Red-tinted wave fills (subtle)
      const waveGrad = ctx.createLinearGradient(0, offsetY - amplitude, 0, offsetY + amplitude);
      if (wave === 0) {
        waveGrad.addColorStop(0, "rgba(204, 0, 1, 0.08)");  // johor-red
        waveGrad.addColorStop(1, "rgba(204, 0, 1, 0.02)");
      } else if (wave === 1) {
        waveGrad.addColorStop(0, "rgba(0, 51, 102, 0.15)");  // johor-navy
        waveGrad.addColorStop(1, "rgba(0, 31, 61, 0.05)");
      } else {
        waveGrad.addColorStop(0, "rgba(204, 0, 1, 0.06)");
        waveGrad.addColorStop(1, "rgba(0, 10, 20, 0.01)");
      }
      ctx.fillStyle = waveGrad;
      ctx.fill();
    }

    // Floating particles (subtle dots)
    for (let i = 0; i < 25; i++) {
      const px = ((i * 137.5 + t * 12 * (0.5 + i * 0.02)) % w);
      const py = ((i * 73 + Math.sin(t + i) * 40) % h);
      const alpha = 0.15 + Math.sin(t * 2 + i) * 0.1;
      const size = 1 + (i % 3);

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    timeRef.current += 0.016; // ~60fps delta
    animRef.current = requestAnimationFrame(draw);
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw, canvasRef]);
}

// ── Hero Section ────────────────────────────────────────────
export function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>("vacancy");
  const [query, setQuery]         = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCanvasBackground(canvasRef);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/direktori/${activeTab}?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section
      className="relative overflow-hidden bg-johor-navy-900 pb-28 pt-20"
      aria-labelledby="hero-heading"
    >
      {/* ── Animated Canvas Background ──────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
      />

      {/* ── Decorative blobs ────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-johor-red-500/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-johor-red-500/08 blur-3xl" />
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="container relative z-20 mx-auto px-4 text-center">
        {/* Badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-johor-red-400" />
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
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/75 transition-colors hover:border-johor-red-400/50 hover:bg-white/20 hover:text-white"
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