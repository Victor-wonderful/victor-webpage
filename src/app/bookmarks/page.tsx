import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserBookmarkSlugs } from "@/lib/bookmarks";
import { getAllPosts } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "북마크",
  description: "내가 저장한 글 목록.",
  robots: { index: false, follow: false },
};

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    redirect(`/login?next=${encodeURIComponent("/bookmarks")}`);
  }

  const [slugs, allPosts] = await Promise.all([
    getUserBookmarkSlugs(),
    getAllPosts(),
  ]);
  const order = new Map(slugs.map((s, i) => [s, i]));
  const posts = allPosts
    .filter((p) => order.has(p.slug))
    .sort((a, b) => (order.get(a.slug)! - order.get(b.slug)!));

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">My Library</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        북마크
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        나중에 다시 읽기 위해 저장한 글들입니다.
      </p>

      {posts.length === 0 ? (
        <div className="mt-12 rounded-md border border-border bg-surface-warm p-8 text-center">
          <p className="font-serif-body text-fg-muted">
            아직 저장한 글이 없습니다.
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2 text-pill text-white hover:bg-accent-hover"
          >
            전체 글 보기
          </Link>
        </div>
      ) : (
        <ul className="mt-12 space-y-8 border-t border-border pt-8">
          {posts.map((p) => {
            const category = getCategory(p.category);
            return (
              <li key={p.slug}>
                {category && (
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-eyebrow text-accent hover:underline"
                  >
                    {category.label}
                  </Link>
                )}
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="hover:text-accent"
                  >
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-2 font-serif-body text-base text-fg-muted">
                  {p.summary}
                </p>
                <time
                  dateTime={p.publishedAt}
                  className="mt-3 block text-meta text-fg-muted"
                >
                  {formatDate(p.publishedAt)}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
