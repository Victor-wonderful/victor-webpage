import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { PillNav } from "@/components/pill-nav";

export const metadata: Metadata = {
  title: "전체 글",
  description: "Pine Script · 시장분석 · 전략 · 차트노트.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <>
      <section className="container-page mt-12">
        <header className="grid items-end gap-6 border-b border-border pb-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-eyebrow text-accent">Archive</p>
            <h1 className="mt-3 font-display text-[56px] font-extrabold leading-[0.95] tracking-tighter md:text-[80px]">
              전체 글
            </h1>
          </div>
          <p className="text-meta text-fg-muted">총 {posts.length}개의 글</p>
        </header>
        <div className="mt-8">
          <PillNav />
        </div>
      </section>

      <section className="container-page mt-12">
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block py-8 transition-colors hover:bg-surface-warm/50"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-baseline">
                  <div className="min-w-0">
                    <h2 className="font-serif-body text-2xl font-bold leading-snug tracking-tight group-hover:text-accent md:text-3xl">
                      {p.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-fg-muted">
                      {p.summary}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2 text-[11px]">
                      {p.tags.map((t) => (
                        <li
                          key={t}
                          className="rounded-full bg-surface-warm px-2 py-1 text-fg-muted"
                        >
                          #{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <time
                    dateTime={p.publishedAt}
                    className="shrink-0 text-meta text-fg-muted"
                  >
                    {formatDate(p.publishedAt)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
