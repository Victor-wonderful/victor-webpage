import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/**
 * Today's macro daily post — surfaces the latest "오늘의 시장" signal
 * directly under the Promise 01 header on the home page.
 */
export function DailySignalCard({ post }: { post: Post | undefined }) {
  if (!post) {
    return (
      <section className="container-page mt-6">
        <div className="rounded-md border border-dashed border-border bg-surface-warm p-8 text-center text-fg-muted">
          오늘의 데일리 시황 글이 아직 발행되지 않았습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="container-page mt-6">
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-md border border-border bg-surface p-8 transition-colors hover:border-accent hover:bg-surface-warm/40 md:p-10"
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-eyebrow text-accent">오늘의 시그널</p>
          <p className="text-meta text-fg-muted">
            {formatDate(post.publishedAt)}
          </p>
        </div>
        <h3 className="mt-4 break-keep font-display text-3xl font-extrabold leading-[1.1] tracking-tighter group-hover:text-accent md:text-4xl">
          {post.title}
        </h3>
        <p className="mt-4 max-w-3xl font-serif-body text-lg italic text-fg-muted line-clamp-3">
          {post.summary}
        </p>
        <p className="mt-6 text-meta text-accent group-hover:underline">
          전문 읽기 →
        </p>
      </Link>
    </section>
  );
}
