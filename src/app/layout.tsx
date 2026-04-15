import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Victor",
    template: "%s | Victor",
  },
  description: "개발, 디자인, 트레이딩에 관한 기록.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
