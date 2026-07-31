import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Laman Web TVET Negeri Johor",
    template: "%s | TVET Johor",
  },
  description:
    "Portal Rasmi TVET Negeri Johor — menghubungkan bakat, industri, dan penyedia latihan untuk membangunkan ekosistem kemahiran negeri.",
  keywords: ["TVET", "Johor", "ADTEC", "JTDC", "Latihan Teknikal", "Vokasional", "Kemahiran"],
  authors: [{ name: "ADTEC JTM Kampus Pasir Gudang" }],
  openGraph: {
    type: "website",
    locale: "ms_MY",
    siteName: "Laman Web TVET Negeri Johor",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
