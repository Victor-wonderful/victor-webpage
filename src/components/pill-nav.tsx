"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const ITEMS: Array<{ label: string; href: string }> = [
  { label: "시장인사이트", href: "/category/market" },
  { label: "트레이딩 전략", href: "/category/strategy" },
  { label: "Pine Script", href: "/category/pinescript" },
  { label: "입문 가이드", href: "/category/basics" },
  { label: "매크로·뉴스", href: "/category/macro" },
];

export function PillNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="카테고리"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {ITEMS.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/blog" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full border px-4 py-2 text-pill transition-colors",
              active
                ? "border-ink bg-ink text-bg"
                : "border-ink/70 bg-transparent text-ink hover:border-accent hover:text-accent",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
