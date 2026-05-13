import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPostsPage, POSTS_PER_PAGE } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { PillNav } from "@/components/pill-nav";
import { Pagination } from "@/components/pagination";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "전체 글",
  description: "시장분석 · 전략 · 토큰 심층분석 · 차트노트.",
};

type Search = { page?: string };

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);

  const { posts, total, totalPages } = await getAllPostsPage(
    page,
    POSTS_PER_PAGE,
  );

  if (total > 0 && page > totalPages) notFound();

  return (
    <>
      <section className="container-page mt-12">
        <header className="grid items-end gap-6 border-b border-border pb-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-eyebrow text-accent">Archive</p>
            <h1 className="mt-3 font-display text-[40px] font-extrabold leading-[0.95] tracking-tighter md:text-[56px]">
              전체 글
            </h1>
          </div>
          <p className="text-meta text-fg-muted">
            총 {total}개의 글
            {totalPages > 1 && ` · ${page} / ${totalPages} 페이지`}
          </p>
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

        <Pagination
          basePath="/blog"
          currentPage={page}
          totalPages={totalPages}
        />
      </section>
    </>
  );
}
