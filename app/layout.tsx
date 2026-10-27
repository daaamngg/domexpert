import type { Metadata, Viewport } from "next";
import { Bitter, Onest } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactBar from "@/components/ContactBar";
import RequestPanel from "@/components/request/RequestPanel";
import RequestButton from "@/components/request/RequestButton";

// Пара шрифтов — направление «Графит» (DESIGN.md).
// Заголовки и крупные цифры — брусковый Bitter (28.10 Арслан: «меняй шрифт
// и у цифр, и у букв»; сравнение — design/shrifty-28-10.png). Крепкий, «рабочий»,
// цифры ровные и широкие — номер телефона и цены «от» читаются с первого взгляда.
// До него была антиква Brygada 1918 (цифры с «хвостами»), ещё раньше Vollkorn.
// Только 600 и 700: каждое начертание — отдельный файл на каждый алфавит.
const heading = Bitter({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

// Onest — основной текст: спокойный гротеск, хорошо читается мелко.
const onest = Onest({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — уборка и благоустройство участков в Самаре`,
    template: `%s · ${site.name}`,
  },
  description:
    "Уборка территории, покос, спил и корчевание, вывоз мусора, огород, заборы, дрова. Своя техника, фиксированная цена после звонка. Самара и Самарская область.",
  openGraph: { type: "website", locale: "ru_RU", siteName: site.name },
  // Демо: в поиск не пускаем, пока Сергей не утвердил сайт.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${heading.variable} ${onest.variable}`}>
      <body>
        <Header />
        <main className="pt-14 lg:pt-16">{children}</main>
        <Footer />
        <ContactBar />
        <RequestButton variant="floating" />
        <RequestPanel />
      </body>
    </html>
  );
}
