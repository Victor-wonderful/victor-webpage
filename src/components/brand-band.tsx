import Link from "next/link";
import { WordMark } from "./word-mark";
import { SocialDots } from "./social-dots";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/cn";

type Variant = "header" | "footer";

const CATEGORY_LINKS = CATEGORIES.map((c) => ({
  label: c.label,
  href: `/category/${c.slug}`,
}));

const FOOTER_LINKS = [
  ...CATEGORY_LINKS,
  { label: "도구", href: "/tools" },
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
          "dark:border-bg/15 dark:text-fg",
          className,
        )}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <WordMark size="sm" asLink className="text-bg dark:text-fg" />
          <nav className="hidden items-center gap-5 text-meta lg:flex">
            {CATEGORY_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-accent">
                {l.label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="font-semibold text-accent hover:text-accent-hover"
            >
              도구
            </Link>
          </nav>
          <div className="flex items-center gap-3 text-meta">
            <ThemeToggle />
            <Link
              href="/subscribe"
              className="hidden rounded-full bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-accent-hover sm:inline-block"
            >
              구독하기
            </Link>
            <UserMenu className="hidden lg:flex" />
            <MobileMenu />
          </div>
        </div>
      </header>
    );
  }

  // footer — balanced with header (smaller wordmark, tighter spacing)
  return (
    <footer
      className={cn(
        "mt-16 w-full bg-ink text-bg",
        "dark:text-fg",
        className,
      )}
    >
      <div className="container-page flex flex-col gap-6 py-8">
        {/* Row: wordmark left, social right */}
        <div className="flex items-center justify-between gap-6">
          <WordMark size="sm" asLink className="text-bg dark:text-fg" />
          <SocialDots className="shrink-0" />
        </div>

        <hr className="border-bg/20 dark:border-fg/15" />

        {/* Nav — single horizontal row, scrolls on narrow screens */}
        <nav aria-label="푸터 메뉴" className="text-meta">
          <ul className="-mx-1 flex items-center gap-x-5 overflow-x-auto whitespace-nowrap px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href} className="shrink-0">
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tagline + copyright on one line at md+ */}
        <div className="flex flex-col gap-1 text-meta text-bg/60 dark:text-fg/60 md:flex-row md:items-center md:justify-between">
          <p>라이브 대시보드와 함께 읽는 트레이딩 전략·시장 인사이트</p>
          <p>© 2026 Victor Alpha</p>
        </div>
      </div>
    </footer>
  );
}
