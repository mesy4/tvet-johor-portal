import { requireRole }  from "@/lib/session";
import { prisma }       from "@/lib/prisma";
import { formatDate }   from "@/lib/utils";
import Link             from "next/link";
import { PlusCircle, Newspaper } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pengurusan Berita" };

const STATUS_STYLES: Record<string, string> = {
  DRAFT:     "bg-gray-100 text-gray-600",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED:  "bg-slate-100 text-slate-600",
};
const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draf", PUBLISHED: "Disiarkan", ARCHIVED: "Diarkib",
};
const CATEGORY_LABELS: Record<string, string> = {
  ANNOUNCEMENT:     "Pengumuman",
  EVENT:            "Acara",
  ACHIEVEMENT:      "Pencapaian",
  CIRCULAR:         "Pekeliling",
  INDUSTRY_NEWS:    "Berita Industri",
  VACANCY_HIGHLIGHT:"Sorotan Kerja",
};

export default async function AdminNewsPage() {
  await requireRole(["SUPERADMIN", "ADMIN_ADTEC", "ADMIN_JTDC"]);

  const newsItems = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, slug: true, category: true,
      status: true, viewCount: true, publishedAt: true, createdAt: true,
      author: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Pengurusan Berita</h1>
        <p className="mt-1 text-sm text-gray-500">{newsItems.length} artikel</p>
      </div>

      {newsItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <Newspaper className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">Belum ada artikel berita.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Tajuk</th>
                  <th className="px-5 py-3 hidden md:table-cell">Kategori</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Penulis</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Paparan</th>
                  <th className="px-5 py-3 hidden md:table-cell">Tarikh</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {newsItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800 line-clamp-1 max-w-xs">{item.title}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">{item.author.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.status] ?? ""}`}>
                        {STATUS_LABELS[item.status] ?? item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">{item.viewCount}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-500">
                      {item.publishedAt ? formatDate(item.publishedAt) : formatDate(item.createdAt)}
                    </td>
                    <td className="px-5 py-3.5"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
