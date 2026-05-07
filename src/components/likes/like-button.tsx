"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLike } from "@/lib/likes";

/**
 * Heart toggle. Server provides initial { liked, count }; we render
 * an optimistic update on click so the UI feels instant.
 *
 * Non-logged-in users get redirected to /login.
 */
export function LikeButton({
  slug,
  initialCount,
  initialLiked,
  isLoggedIn,
}: {
  slug: string;
  initialCount: number;
  initialLiked: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [state, setOptimistic] = useOptimistic(
    { count: initialCount, liked: initialLiked },
    (prev, _: void) => ({
      count: prev.count + (prev.liked ? -1 : 1),
      liked: !prev.liked,
    }),
  );

  const onClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(`/blog/${slug}`)}`);
      return;
    }
    startTransition(async () => {
      setOptimistic();
      const fd = new FormData();
      fd.set("slug", slug);
      try {
        await toggleLike(fd);
      } catch (e) {
        console.error("[likes] toggle failed:", e);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={state.liked}
      aria-label={state.liked ? "좋아요 취소" : "좋아요"}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-pill transition-colors disabled:opacity-60 ${
        state.liked
          ? "border-accent bg-accent text-white hover:bg-accent-hover"
          : "border-ink/30 bg-transparent text-fg hover:border-accent hover:text-accent dark:border-fg/30"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={state.liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="tabular-nums">{state.count}</span>
    </button>
  );
}
