"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/cn";

export function PillNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const items = CATEGORIES.map((c) => ({
    label: c.label,
    href: `/category/${c.slug}`,
  }));
  return (
    <nav
      aria-label="카테고리"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {items.map((item) => {
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
                ? "border-ink bg-ink text-bg dark:border-fg dark:bg-fg dark:text-ink"
                : "border-ink/70 bg-transparent text-ink hover:border-accent hover:text-accent dark:border-fg/40 dark:text-fg",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
