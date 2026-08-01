import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, truncate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

// Fetch latest published news (Server Component — direct DB call)
async function getLatestNews() {
  return prisma.news.findMany({
    where:   { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take:    6,
    select: {
      id:           true,
      title:        true,
      slug:         true,
      excerpt:      true,
      featuredImage: true,
      category:     true,
      publishedAt:  true,
      isFeatured:   true,
    },
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  ANNOUNCEMENT:     "Pengumuman",
  EVENT:            "Acara",
  ACHIEVEMENT:      "Pencapaian",
  CIRCULAR:         "Pekeliling",
  INDUSTRY_NEWS:    "Berita Industri",
  VACANCY_HIGHLIGHT:"Sorotan Kerja",
};

export async function NewsGrid() {
  const newsItems = await getLatestNews();

  if (newsItems.length === 0) {
    return null; // gracefully hide section if no news yet
  }

  const [featured, ...rest] = newsItems;

  return (
    <section className="bg-white py-20" aria-labelledby="news-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-johor-red-500">
              Terkini
            </p>
            <h2
              id="news-heading"
              className="font-heading text-3xl font-bold text-johor-navy-700 sm:text-4xl"
            >
              Berita &amp; Sorotan
            </h2>
          </div>
          <Link
            href="/berita"
            className="hidden items-center gap-1 text-sm font-medium text-johor-navy-600 hover:text-johor-red-500 sm:flex"
          >
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Featured card — takes 2 columns on lg */}
          <Link
            href={`/berita/${featured.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-johor-navy-900 lg:col-span-2"
          >
            {featured.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.featuredImage}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-johor-navy-700 to-johor-red-900 opacity-80" />
            )}
            <div className="relative flex h-full min-h-72 flex-col justify-end p-7">
              <Badge variant="red" className="mb-3 w-fit">
                {CATEGORY_LABELS[featured.category] ?? featured.category}
              </Badge>
              <h3 className="font-heading text-xl font-bold text-white transition-colors group-hover:text-johor-gold lg:text-2xl">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="mt-2 text-sm text-white/70 line-clamp-2">
                  {featured.excerpt}
                </p>
              )}
              {featured.publishedAt && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-white/50">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDate(featured.publishedAt)}
                </p>
              )}
            </div>
          </Link>

          {/* Secondary cards */}
          <div className="flex flex-col gap-6">
            {rest.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-johor-navy-100 hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-johor-navy-100 to-johor-navy-200" />
                  )}
                </div>

                <div className="flex flex-col justify-between py-0.5">
                  <div>
                    <Badge variant="navy" className="mb-1.5 text-[10px]">
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </Badge>
                    <h3 className="text-sm font-semibold leading-snug text-gray-800 line-clamp-2 group-hover:text-johor-navy-600">
                      {item.title}
                    </h3>
                  </div>
                  {item.publishedAt && (
                    <p className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {formatDate(item.publishedAt)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile "see all" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/berita"
            className="inline-flex items-center gap-1 text-sm font-medium text-johor-navy-600"
          >
            Lihat semua berita <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
