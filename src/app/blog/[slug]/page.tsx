import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import { EditorialImage } from "@/components/editorial-image";

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
  const category = getCategory(post.category);

  return (
    <article>
      {/* Header */}
      <header className="container-prose mt-12 border-b border-border pb-10">
        <Link
          href="/blog"
          className="text-meta text-fg-muted hover:text-accent"
        >
          ← 전체 글
        </Link>
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="mt-8 block text-eyebrow text-accent hover:underline"
          >
            {category.label}
          </Link>
        )}
        <h1 className="mt-4 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
          {post.title}
        </h1>
        <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
          {post.summary}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-meta text-fg-muted">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-bg">
            V
          </span>
          <span className="font-medium text-fg">Victor</span>
          <span>·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <span>읽는 시간 4분</span>
        </div>
      </header>

      {/* Full-bleed cover */}
      <div className="mt-10 w-full">
        <EditorialImage seed={post.slug} variant="hero" priority alt={post.title} />
      </div>

      {/* Body */}
      <div className="container-prose mt-12">
        <div className="font-serif-body whitespace-pre-wrap text-[18px] leading-[1.7] text-fg">
          {post.content}
        </div>

        {/* Tags */}
        <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
          {post.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-ink/20 bg-surface-warm px-3 py-1.5 text-pill text-fg"
            >
              #{t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
