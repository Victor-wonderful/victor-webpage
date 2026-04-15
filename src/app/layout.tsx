import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import { BrandBand } from "@/components/brand-band";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});
const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Victor Alpha",
    template: "%s | Victor Alpha",
  },
  description: "Pine Script로 시작하는 트레이딩 전략과 시장 인사이트.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* Apply stored theme before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('victor-alpha-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-bg text-fg antialiased">
        <BrandBand variant="header" />
        <main>{children}</main>
        <BrandBand variant="footer" />
      </body>
    </html>
  );
}
