import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/format";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: "article" },
  };
}

export default async function PostPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="space-y-8">
      <div>
        <Link
          href="/blog"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          ← 블로그
        </Link>
      </div>

      <header className="space-y-4 border-b border-neutral-200 pb-8 dark:border-neutral-800">
        {post.coverEmoji && <div className="text-5xl">{post.coverEmoji}</div>}
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          {post.summary}
        </p>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <div className="flex gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="prose-content whitespace-pre-wrap text-base leading-7 text-neutral-800 dark:text-neutral-200">
        {post.content}
      </div>
    </article>
  );
}
