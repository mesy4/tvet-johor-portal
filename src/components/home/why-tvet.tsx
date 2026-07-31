import { Zap, TrendingUp, Award, Users } from "lucide-react";

const REASONS = [
  {
    icon:  Zap,
    title: "Kemasukan Lebih Pantas ke Kerjaya",
    desc:  "Program TVET direka untuk mempersiapkan pelajar memasuki dunia pekerjaan dengan lebih cepat berbanding laluan konvensional.",
  },
  {
    icon:  TrendingUp,
    title: "Latihan Selari Industri Sebenar",
    desc:  "Kurikulum dibangunkan bersama industri untuk memastikan kemahiran yang dipelajari relevan dan dikehendaki majikan.",
  },
  {
    icon:  Award,
    title: "Pensijilan Diiktiraf & Boleh Disahkan",
    desc:  "Sijil TVET diiktiraf oleh JPK, MQA, dan badan akreditasi antarabangsa untuk mobiliti kerjaya global.",
  },
  {
    icon:  Users,
    title: "Kebolehpasaran Tinggi",
    desc:  "Lebih 85% graduan TVET Johor mendapat pekerjaan dalam tempoh 6 bulan selepas tamat pengajian.",
  },
];

export function WhyTvet() {
  return (
    <section className="bg-johor-navy-900 py-20 text-white" aria-labelledby="why-tvet-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-gold">
            Kelebihan TVET
          </p>
          <h2
            id="why-tvet-heading"
            className="font-heading text-3xl font-bold sm:text-4xl"
          >
            Mengapa Memilih TVET?
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-johor-gold/30 hover:bg-white/10"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-johor-gold/15">
                  <Icon className="h-5 w-5 text-johor-gold" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-base font-semibold leading-snug">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
