import Link from "next/link";
import { WordMark } from "./word-mark";
import { SocialDots } from "./social-dots";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/cn";

type Variant = "header" | "footer";

const FOOTER_LINKS = [
  { label: "시장인사이트", href: "/category/market" },
  { label: "트레이딩 전략", href: "/category/strategy" },
  { label: "Pine Script", href: "/category/pinescript" },
  { label: "입문 가이드", href: "/category/basics" },
  { label: "매크로·뉴스", href: "/category/macro" },
  { label: "소개", href: "/about" },
  { label: "구독", href: "/subscribe" },
  { label: "RSS", href: "/rss.xml" },
];

export function BrandBand({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  if (variant === "header") {
    return (
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-ink/30 bg-ink text-bg",
          className,
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <WordMark size="sm" asLink className="text-bg" />
          <nav className="hidden items-center gap-5 text-meta lg:flex">
            <Link href="/category/market" className="hover:text-accent">시장인사이트</Link>
            <Link href="/category/strategy" className="hover:text-accent">트레이딩 전략</Link>
            <Link href="/category/pinescript" className="hover:text-accent">Pine Script</Link>
            <Link href="/category/basics" className="hover:text-accent">입문 가이드</Link>
            <Link href="/category/macro" className="hover:text-accent">매크로·뉴스</Link>
          </nav>
          <div className="flex items-center gap-3 text-meta">
            <ThemeToggle />
            <Link
              href="/subscribe"
              className="hidden rounded-full bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-accent-hover sm:inline-block"
            >
              구독하기
            </Link>
            <Link href="/login" className="hidden hover:text-accent lg:inline">
              로그인
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>
    );
  }

  // footer
  return (
    <footer
      className={cn("mt-24 w-full bg-ink text-bg", className)}
    >
      <div className="container-page flex flex-col gap-10 py-14">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <WordMark size="xl" className="block max-w-full text-bg" />
          <SocialDots className="shrink-0" />
        </div>
        <hr className="border-bg/20" />
        <div className="flex flex-col items-start justify-between gap-6 text-meta md:flex-row md:items-center">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-bg/60">
            Pine Script로 시작하는 트레이딩 전략과 시장 인사이트 · © 2026 Victor Alpha
          </p>
        </div>
      </div>
    </footer>
  );
}
