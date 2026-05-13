import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategory, isCategorySlug } from "@/lib/categories";
import { getPostsByCategoryPage, POSTS_PER_PAGE } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { PillNav } from "@/components/pill-nav";
import { PostCoverImage } from "@/components/post-cover-image";
import { Pagination } from "@/components/pagination";

export const revalidate = 60;

type Params = { slug: string };
type Search = { page?: string };

export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return { title: "카테고리를 찾을 수 없습니다" };
  return {
    title: c.label,
    description: c.description,
  };
}

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  if (!isCategorySlug(slug)) notFound();
  const category = getCategory(slug)!;
  const page = parsePage(sp.page);

  const { posts, total, totalPages } = await getPostsByCategoryPage(
    slug,
    page,
    POSTS_PER_PAGE,
  );

  // Out-of-range page → 404 (better than empty list)
  if (total > 0 && page > totalPages) notFound();

  const basePath = `/category/${slug}`;

  return (
    <>
      {/* Header */}
      <section className="container-page mt-12">
        <header className="grid items-end gap-6 border-b border-border pb-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-eyebrow text-accent">{category.eyebrow}</p>
            <h1 className="mt-3 font-display text-[40px] font-extrabold leading-[0.95] tracking-tighter md:text-[56px]">
              {category.label}
            </h1>
            <p className="mt-4 max-w-xl text-meta text-fg-muted">
              {category.description}
            </p>
          </div>
          <p className="text-meta text-fg-muted">
            총 {total}개의 글
            {totalPages > 1 && ` · ${page} / ${totalPages} 페이지`}
            {slug === "basics" && (
              <>
                {" · "}
                <Link href="/basics" className="text-accent hover:underline">
                  챕터 순 보기 →
                </Link>
              </>
            )}
          </p>
        </header>
        <div className="mt-8">
          <PillNav />
        </div>
      </section>

      {/* List */}
      <section className="container-page mt-12">
        {posts.length === 0 ? (
          <div className="border-y border-border py-20 text-center">
            <p className="text-meta text-fg-muted">
              아직 이 카테고리에 글이 없습니다.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-accent hover:underline"
            >
              전체 글 보기 →
            </Link>
          </div>
        ) : (
          <>
            <ul className="grid gap-10 md:grid-cols-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block overflow-hidden rounded-md border border-border bg-surface transition-colors hover:border-accent"
                  >
                    <PostCoverImage post={p} variant="wide" alt={p.title} />
                    <div className="p-6">
                      <p className="text-eyebrow text-fg-muted">
                        {category.label}
                      </p>
                      <h2 className="mt-3 font-serif-body text-2xl font-bold leading-snug tracking-tight group-hover:text-accent">
                        {p.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-fg-muted">
                        {p.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-meta text-fg-muted">
                        <time dateTime={p.publishedAt}>
                          {formatDate(p.publishedAt)}
                        </time>
                        <ul className="flex flex-wrap gap-2">
                          {p.tags.slice(0, 2).map((t) => (
                            <li
                              key={t}
                              className="rounded-full bg-surface-warm px-2 py-1 text-[11px]"
                            >
                              #{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <Pagination
              basePath={basePath}
              currentPage={page}
              totalPages={totalPages}
            />
          </>
        )}
      </section>
    </>
  );
}
