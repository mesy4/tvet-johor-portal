import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita & Sorotan — Sekretariat TVET Negeri Johor",
  description: "Berita terkini, pengumuman, acara, dan sorotan daripada ekosistem Sekretariat TVET Negeri Johor.",
};

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const articles = await prisma.news.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      category: true,
      publishedAt: true,
      isFeatured: true,
    },
  });

  if (articles.length === 0) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-red-500">Berita & Sorotan</p>
          <h1 className="font-heading text-4xl font-bold text-johor-navy-700">Berita & Sorotan</h1>
          <div className="mt-16 rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16">
            <p className="text-gray-500">Tiada berita buat masa ini. Sila kunjungi semula nanti.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-red-500">Berita & Sorotan</p>
          <h1 className="font-heading text-4xl font-bold text-johor-navy-700">Berita & Sorotan</h1>
          <p className="mt-3 text-gray-500">
            Berita terkini, pengumuman, dan sorotan daripada ekosistem Sekretariat TVET Negeri Johor.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/berita/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden bg-johor-navy-100">
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-johor-navy-100 to-johor-navy-200">
                    <span className="text-4xl font-bold text-johor-navy-300">TVET</span>
                  </div>
                )}
                {article.isFeatured && (
                  <span className="absolute left-3 top-3 rounded-full bg-johor-gold px-2.5 py-0.5 text-xs font-semibold text-johor-navy-900">
                    Sorotan
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-2 inline-block w-fit rounded-full bg-johor-navy-50 px-2.5 py-0.5 text-xs font-medium text-johor-navy-600">
                  {article.category === "ANNOUNCEMENT" ? "Pengumuman" :
                   article.category === "EVENT" ? "Acara" :
                   article.category === "ACHIEVEMENT" ? "Pencapaian" :
                   article.category === "CIRCULAR" ? "Pekeliling" :
                   article.category === "INDUSTRY_NEWS" ? "Berita Industri" :
                   article.category === "VACANCY_HIGHLIGHT" ? "Sorotan Kekosongan" :
                   article.category}
                </span>
                <h2 className="mb-2 font-heading text-lg font-semibold text-johor-navy-700 group-hover:text-johor-red-500 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mb-4 flex-1 text-sm text-gray-500 line-clamp-3">{article.excerpt}</p>
                )}
                <p className="text-xs text-gray-400">
                  {article.publishedAt ? formatDate(article.publishedAt) : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}