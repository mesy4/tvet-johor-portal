import { Users, Briefcase, BookOpen, Building2 } from "lucide-react";

const STATS = [
  { icon: Users,      value: "12,000+", label: "Pelajar & Belia Berdaftar" },
  { icon: Briefcase,  value: "1,800+",  label: "Iklan Kerja Aktif" },
  { icon: BookOpen,   value: "320+",    label: "Program Latihan" },
  { icon: Building2,  value: "450+",    label: "Syarikat Industri" },
];

export function StatsBar() {
  return (
    <section
      className="relative -mt-14 z-10"
      aria-label="Statistik portal"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl shadow-xl lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 bg-white px-6 py-6 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-johor-navy-50">
                  <Icon className="h-5 w-5 text-johor-navy-600" aria-hidden="true" />
                </div>
                <p className="font-heading text-2xl font-bold text-johor-navy-700">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
