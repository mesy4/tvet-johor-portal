import { InquiryForm } from "@/components/home/inquiry-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami — Sekretariat TVET Negeri Johor",
  description: "Hubungi pasukan TVET Negeri Johor. Kami sedia membantu sebarang pertanyaan anda.",
};

export default function HubungiPage() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-johor-red-500">Hubungi Kami</p>
          <h1 className="font-heading text-4xl font-bold text-johor-navy-700">Hubungi Kami</h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Ada sebarang pertanyaan mengenai program latihan, peluang kerjaya, atau pendaftaran? Pasukan kami sedia membantu anda.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5">
          {/* Contact info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-johor-navy-50 p-6">
              <h2 className="mb-4 font-heading text-lg font-semibold text-johor-navy-700">Maklumat Perhubungan</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-johor-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-johor-navy-700">Alamat</p>
                    <p className="text-sm text-gray-500">
                      ADTEC JTM Kampus Pasir Gudang<br />
                      Jalan Bandar, 81700 Pasir Gudang<br />
                      Johor Darul Ta'zim
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-johor-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-johor-navy-700">Telefon</p>
                    <p className="text-sm text-gray-500">+607-000 0000</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-johor-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-johor-navy-700">Emel</p>
                    <p className="text-sm text-gray-500">info@tvetjohor.gov.my</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-johor-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-johor-navy-700">Waktu Operasi</p>
                    <p className="text-sm text-gray-500">
                      Isnin – Khamis: 8:00 AM – 5:00 PM<br />
                      Jumaat: 8:00 AM – 12:15 PM, 2:45 PM – 5:00 PM<br />
                      Sabtu & Ahad: Tutup
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="mb-6 font-heading text-xl font-semibold text-johor-navy-700">Hantar Mesej</h2>
              <InquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}