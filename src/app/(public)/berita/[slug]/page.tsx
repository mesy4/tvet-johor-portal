import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.news.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true },
  });

  if (!article) {
    return { title: "Berita Tidak Ditemui" };
  }

  return {
    title: `${article.title} — TVET Negeri Johor`,
    description: article.excerpt ?? undefined,
  };
}

export const revalidate = 300;

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.news.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!article) {
    notFound();
  }

  const categoryLabel =
    article.category === "ANNOUNCEMENT" ? "Pengumuman" :
    article.category === "EVENT" ? "Acara" :
    article.category === "ACHIEVEMENT" ? "Pencapaian" :
    article.category === "CIRCULAR" ? "Pekeliling" :
    article.category === "INDUSTRY_NEWS" ? "Berita Industri" :
    article.category === "VACANCY_HIGHLIGHT" ? "Sorotan Kekosongan" :
    article.category;

  return (
    <article className="bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Back link */}
        <Link
          href="/berita"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-johor-navy-500 hover:text-johor-red-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Senarai Berita
        </Link>

        {/* Category badge */}
        <span className="mb-4 inline-block rounded-full bg-johor-navy-50 px-3 py-1 text-sm font-medium text-johor-navy-600">
          {categoryLabel}
        </span>

        {/* Title */}
        <h1 className="mb-6 font-heading text-3xl font-bold text-johor-navy-700 sm:text-4xl">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {article.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(article.publishedAt)}
            </span>
          )}
          {article.tags && article.tags.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {article.tags.join(", ")}
            </span>
          )}
        </div>

        {/* Featured image */}
        {article.featuredImage && (
          <div className="mb-10 overflow-hidden rounded-2xl">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full object-cover max-h-96"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-johor-navy-700 prose-a:text-johor-red-500"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Divider */}
        <hr className="my-12 border-gray-200" />

        {/* Back link (bottom) */}
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-medium text-johor-navy-500 hover:text-johor-red-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Senarai Berita
        </Link>
      </div>
    </article>
  );
}