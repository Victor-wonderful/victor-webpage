"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/cn";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-bg hover:text-accent dark:text-fg lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-5 w-5"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Panel */}
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-ink text-bg shadow-xl transition-transform dark:text-fg",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-bg/15 dark:border-fg/15 px-6 py-4">
            <span className="font-display text-xl font-extrabold uppercase tracking-tight">
              VICTOR <span className="italic">ALPHA</span>
            </span>
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:text-accent"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <p className="text-eyebrow text-accent">Categories</p>
            <ul className="mt-4 space-y-1">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="block py-3 font-serif-body text-2xl font-bold tracking-tight hover:text-accent"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="my-8 border-bg/15 dark:border-fg/15" />

            <p className="text-eyebrow text-accent">More</p>
            <ul className="mt-4 space-y-1">
              {[
                { label: "도구", href: "/tools" },
                { label: "전체 글", href: "/blog" },
                { label: "북마크", href: "/bookmarks" },
                { label: "소개", href: "/about" },
                { label: "Alpha Research 구독", href: "/subscribe" },
                { label: "회원가입", href: "/signup" },
                { label: "로그인", href: "/login" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-2 text-base hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-bg/15 dark:border-fg/15 p-6">
            <Link
              href="/signup"
              className="block w-full rounded-full bg-accent px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              회원가입
            </Link>
            <Link
              href="/login"
              className="mt-2 block w-full rounded-full border border-bg/30 dark:border-fg/30 px-6 py-3 text-center font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              로그인
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
