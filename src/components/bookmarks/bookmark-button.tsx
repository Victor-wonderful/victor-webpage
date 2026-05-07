"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleBookmark } from "@/lib/bookmarks";

export function BookmarkButton({
  slug,
  initialBookmarked,
  isLoggedIn,
}: {
  slug: string;
  initialBookmarked: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [bookmarked, setOptimistic] = useOptimistic(
    initialBookmarked,
    (prev) => !prev,
  );

  const onClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(`/blog/${slug}`)}`);
      return;
    }
    startTransition(async () => {
      setOptimistic(undefined);
      const fd = new FormData();
      fd.set("slug", slug);
      try {
        await toggleBookmark(fd);
      } catch (e) {
        console.error("[bookmarks] toggle failed:", e);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "북마크 해제" : "북마크"}
      title={bookmarked ? "북마크 해제" : "북마크"}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-pill transition-colors disabled:opacity-60 ${
        bookmarked
          ? "border-ink bg-ink text-bg hover:bg-ink-soft dark:border-fg dark:bg-fg dark:text-ink"
          : "border-ink/30 bg-transparent text-fg hover:border-ink hover:text-ink dark:border-fg/30 dark:hover:border-fg dark:hover:text-fg"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span>{bookmarked ? "저장됨" : "저장"}</span>
    </button>
  );
}
