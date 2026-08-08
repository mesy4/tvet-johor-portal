import { GraduationCap, Briefcase, Building2, Target, Users, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami — Sekretariat TVET Negeri Johor",
  description: "Ketahui lebih lanjut mengenai Sekretariat TVET Negeri Johor, visi, misi, dan peranan kami dalam membangunkan ekosistem kemahiran negeri.",
};

const HIGHLIGHTS = [
  {
    icon: Target,
    title: "Visi Kami",
    description: "Menjadi hab kecemerlangan TVET yang menyepadukan bakat, industri, dan penyedia latihan untuk memperkasa ekonomi negeri Johor.",
  },
  {
    icon: Users,
    title: "Misi Kami",
    description: "Menyediakan platform bersepadu yang menghubungkan pelajar, majikan, dan pusat latihan bagi mempertingkatkan kemahiran dan peluang pekerjaan.",
  },
  {
    icon: Award,
    title: "Komitmen Kami",
    description: "Memastikan setiap program latihan memenuhi piawaian industri dan setiap graduan TVET bersedia untuk pasaran kerja.",
  },
];

const PARTNERS = [
  { name: "ADTEC JTM Kampus Pasir Gudang", role: "Pusat Latihan Utama" },
  { name: "Johor Talent Development Council (JTDC)", role: "Rakan Strategik" },
  { name: "Jabatan Tenaga Manusia (JTM)", role: "Badan Induk" },
  { name: "Jabatan Pembangunan Kemahiran (JPK)", role: "Badan Akreditasi" },
];

export default function TentangPage() {
  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-johor-navy-600 to-johor-navy-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-gold">Tentang Kami</p>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">Tentang TVET Negeri Johor</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70 text-lg">
            Portal Rasmi TVET Negeri Johor — menghubungkan bakat, industri, dan penyedia latihan untuk membangunkan ekosistem kemahiran negeri.
          </p>
        </div>
      </div>

      {/* About content */}
      <div className="container mx-auto max-w-5xl px-4 py-20">
        {/* What is TVET */}
        <div className="mb-16">
          <h2 className="mb-6 font-heading text-2xl font-bold text-johor-navy-700">Apa Itu TVET?</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <strong>Pendidikan dan Latihan Teknikal dan Vokasional (TVET)</strong> adalah satu sistem pendidikan yang memberi fokus kepada pembelajaran berasaskan kemahiran dan pekerjaan. TVET merangkumi pelbagai bidang termasuk kejuruteraan, teknologi maklumat, hospitaliti, automotif, pembinaan, dan banyak lagi.
            </p>
            <p>
              Di Johor, ekosistem TVET diterajui oleh <strong>ADTEC JTM Kampus Pasir Gudang</strong> dengan kerjasama strategik <strong>Johor Talent Development Council (JTDC)</strong>. Portal ini bertindak sebagai hab digital yang menghubungkan:
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-johor-navy-50 p-6 text-center">
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-johor-red-500" />
              <h3 className="font-semibold text-johor-navy-700">Pelajar & Belia</h3>
              <p className="mt-2 text-sm text-gray-500">Mencari program latihan dan peluang kerjaya yang sesuai dengan kemahiran anda.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-johor-navy-50 p-6 text-center">
              <Briefcase className="mx-auto mb-3 h-10 w-10 text-johor-red-500" />
              <h3 className="font-semibold text-johor-navy-700">Majikan & Industri</h3>
              <p className="mt-2 text-sm text-gray-500">Mencari bakat berkemahiran dan mempromosikan peluang pekerjaan kepada graduan TVET.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-johor-navy-50 p-6 text-center">
              <Building2 className="mx-auto mb-3 h-10 w-10 text-johor-red-500" />
              <h3 className="font-semibold text-johor-navy-700">Pusat Latihan</h3>
              <p className="mt-2 text-sm text-gray-500">Mempromosikan program latihan dan menghubungkan graduan dengan peluang pekerjaan.</p>
            </div>
          </div>
        </div>

        {/* Vision, Mission, Commitment */}
        <div className="mb-16 grid gap-8 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
              <item.icon className="mx-auto mb-4 h-12 w-12 text-johor-gold" />
              <h3 className="mb-3 font-heading text-xl font-semibold text-johor-navy-700">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div>
          <h2 className="mb-6 font-heading text-2xl font-bold text-johor-navy-700">Rakan Strategik</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PARTNERS.map((partner) => (
              <div key={partner.name} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="font-semibold text-johor-navy-700">{partner.name}</p>
                <p className="mt-1 text-sm text-gray-500">{partner.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}